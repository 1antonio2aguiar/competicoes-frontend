import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd, Navigation } from '@angular/router';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { filter, map } from 'rxjs/operators'; 
import { NbMenuItem } from '@nebular/theme';

import { TipoPessoa } from '../../../shared/models/tipoPessoa';
import { PessoaContextService } from '../../../services/logradouros/pessoa-context.service';

interface SituacaoOpcao {
  valor: string | number; // Depende do que seu backend espera (ex: 'ATIVO' ou 0)
  descricao: string;
}

@Component({
  selector: 'ngx-pessoa-api-iud',
  templateUrl: './pessoa-api-iud.component.html',
  styleUrls: ['./pessoa-api-iud.component.scss']
})

export class PessoaApiIudComponent implements OnInit, OnDestroy {
  modoEdicao = false;

  pessoaId: number | null = null;
  pessoaNome: string | null = null;

  headerTitle = 'Cadastrar Nova Pessoa';
  isPerfilVisible = true; // Controla a visibilidade do formulário de perfil

  pessoaForm!: FormGroup; // "!" para indicar que será inicializado no ngOnInit
  isLoading = false;
  private destroy$ = new Subject<void>();

  tiposPessoas: TipoPessoa[] = [];
  
  situacoes: SituacaoOpcao[] = [
    { valor: 'ATIVO', descricao: 'ATIVO' },      // Ou 0, 'ATIVO'
    { valor: 'INATIVO', descricao: 'INATIVO' },  // Ou 1, 'INATIVO'
    { valor: 'BLOQUEADO', descricao: 'BLOQUEADO' } // Ou 2, 'BLOQUEADO'
    // Ajuste os valores conforme o que seu backend espera e o que você definiu no enum
  ];

  // menuItems agora apontam para rotas filhas relativas
  menuItems: NbMenuItem[] = [
    { title: 'Perfil', icon: 'person-outline', link: './perfil', home: true },
    { title: 'Endereços', icon: 'pin-outline', link: './enderecos' },
    { title: 'Contatos', icon: 'phone-outline', link: './contatos' },
    { title: 'Documentos', icon: 'file-text-outline', link: './documentos' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pessoaContextService: PessoaContextService
  ) {

    /*const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.pessoaNome = navigation.extras.state['pessoaNome'] as string;
    }*/

    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && navigation.extras.state['pessoaNome']) {
      this.pessoaContextService.setPessoaNome(navigation.extras.state['pessoaNome'] as string);
      this.pessoaNome = navigation.extras.state['pessoaNome'] as string;
    } else {
      if (!this.route.snapshot.params['id']) { // Se não tiver ID na rota, é cadastro novo
        this.pessoaContextService.setPessoaNome(null); // Garante que o nome esteja limpo para novo cadastro
      }
    }
  }

  ngOnInit(): void {

    // Observar o ID da pessoa no contexto
    this.pessoaContextService.pessoaId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(idContexto => {
        if (idContexto !== null) {
          this.modoEdicao = true; 
          const idRotaAtual = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;

          if (idRotaAtual !== idContexto) {
            console.log(`Novo perfil salvo (ID: ${idContexto}). Navegando para /editar/${idContexto}/enderecos`);
            this.router.navigate(['./editar', idContexto, 'enderecos'], { relativeTo: this.route.parent });
          }
        } else {
          this.modoEdicao = false;
          this.headerTitle = 'Cadastrar Nova Pessoa';
        }
        this.updateMenuItemsState(); // Atualiza o menu sempre que o ID do contexto mudar
    });

    this.pessoaContextService.pessoaNome$
      .pipe(takeUntil(this.destroy$))
      .subscribe(nomeContexto => {
        const idAtual = this.pessoaContextService.getCurrentPessoaId(); 
        if (this.modoEdicao && idAtual !== null) { 
          this.headerTitle = `Editar Pessoa (${nomeContexto || 'Sem nome'})`;
        } else if (!this.modoEdicao) {
          this.headerTitle = 'Cadastrar Nova Pessoa';
        }
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.modoEdicao = true;
        this.pessoaId = +params['id'];
        this.headerTitle = `Editar Pessoa ( ${this.pessoaNome})`;
      } else {
        this.modoEdicao = false;
        this.pessoaId = null;
        this.headerTitle = 'Cadastrar Nova Pessoa';
      }
      // Atualiza o estado dos itens do menu (principalmente para enabled/disabled)
      this.updateMenuItemsState();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null), // Para verificar no carregamento inicial
      takeUntil(this.destroy$)
    ).subscribe(() => {
        
        let algumaCoisaSelecionadaProgramaticamente = false;
        const currentChildPath = this.getCurrentActivatedChildPath();

        this.menuItems = this.menuItems.map(item => {
            const itemPath = item.link?.toString().replace('./', '');
            let isSelected = itemPath === currentChildPath;

            // Se nenhuma rota filha ativa e o item é 'home', seleciona-o
            if (!currentChildPath && item.home && this.router.url.endsWith('/perfil')) { // Ou após o redirect para perfil
                isSelected = true;
            }
            if (isSelected) algumaCoisaSelecionadaProgramaticamente = true;

            return { ...item, selected: isSelected };
        });

        if (!algumaCoisaSelecionadaProgramaticamente && currentChildPath === null) {
            this.menuItems = this.menuItems.map(item => {
                if (item.home) {
                    return { ...item, selected: true };
                }
                return { ...item, selected: false }; // Garante que outros não estejam
            });
        }
    });
  }

  private getCurrentActivatedChildPath(): string | null {
    let route = this.route.firstChild;
    if (route) {
        return route.snapshot.url[0]?.path || null; // Pega o primeiro segmento da rota filha (ex: 'perfil')
    }
    return null;
  }

  updateMenuItemsState(): void {
    const isNewCadastroAndNoIdYet = !this.modoEdicao && !this.pessoaId;

    this.menuItems = this.menuItems.map(item => {
      const itemPath = item.link?.toString().replace('./', ''); // Ex: 'perfil', 'enderecos'
      let isDisabled = false;

      // Se for um novo cadastro (sem ID de pessoa ainda) E o item NÃO for 'Perfil'
      if (isNewCadastroAndNoIdYet && itemPath !== 'perfil') {
        isDisabled = true; // Desabilita o item
      }

      return {
        ...item,
        disabled: isDisabled,
      };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
