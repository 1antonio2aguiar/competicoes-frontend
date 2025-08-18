import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

import { PessoaApiService } from '../pessoa-api.service';
import { PessoaApiIn } from '../../../shared/models/pessoaApiIn';
import { TiposPessoasService } from '../../../services/tipos-pessoas/TiposPessoasService';
import { TipoPessoa } from '../../../shared/models/tipoPessoa';
import { PessoaApiOut } from '../../../shared/models/pessoaApiOut';

import * as moment from 'moment';
import { PessoaContextService } from '../../../services/logradouros/pessoa-context.service';

interface SituacaoOpcao {
  valor: string | number;
  descricao: string;
} 

@Component({
  selector: 'ngx-pessoa-perfil-form',
  templateUrl: './pessoa-perfil-form.component.html',
  styleUrls: ['./pessoa-perfil-form.component.scss'] // Se tiver estilos específicos
})

export class PessoaPerfilFormComponent implements OnInit, OnDestroy {

  @ViewChild('cpfInput')  cpfInputRef!:  ElementRef<HTMLInputElement>;
  @ViewChild('cnpjInput') cnpjInputRef!: ElementRef<HTMLInputElement>;

  modoEdicao = false;
  pessoaId: number | null = null;
  pessoaNome: string | null = null;
  
  dataNascimentoDisplay: string | null = null;

  pessoaForm!: FormGroup;
  isLoading = false;
  isLoadingDados = false;
  private destroy$ = new Subject<void>();

  tiposPessoas: TipoPessoa[] = [];
  
  situacoes: SituacaoOpcao[] = [
    { valor: 0, descricao: 'ATIVO' },
    { valor: 1, descricao: 'INATIVO' },
    { valor: 2, descricao: 'BLOQUEADO' }
  ];

  // Header do card pode ser fixo ou passado via Input se necessário
  cardHeaderTitle = 'Dados do Perfil';

  constructor(
    private fb: FormBuilder,
    private pessoaApiService: PessoaApiService,
    private tipoPessoaService: TiposPessoasService,
    private route: ActivatedRoute, 
    private router: Router,
    private toastrService: NbToastrService,
    private pessoaContextService: PessoaContextService
  ) {
  }

  ngOnInit(): void {
    this.carregarTiposPessoas();
    this.initForm(); // Inicializar o formulário primeiro
    this.pessoaNome = this.pessoaContextService.getCurrentPessoaNome();

    // Obter o pessoaId da rota PAI (PessoaApiIudComponent)
    this.route.parent?.params.pipe(takeUntil(this.destroy$)).subscribe(parentParams => {
      
      if (parentParams['id']) {
        this.modoEdicao = true;
        this.pessoaId = +parentParams['id'];
        this.cardHeaderTitle = `Editando Perfil (${this.pessoaNome})`;
        this.pessoaForm.get('fisicaJuridica')?.disable();

        // ---- CHAMADA PARA CARREGAR DADOS EM MODO EDIÇÃO ----
        this.carregarDadosPessoaParaEdicao(this.pessoaId);
        // -----------------------------------------------------
      } else {
        this.pessoaForm.get('fisicaJuridica')?.enable();
        this.modoEdicao = false;
        this.pessoaId = null;
        this.cardHeaderTitle = 'Cadastrar Novo Perfil';
      }
    });

    this.pessoaForm.get('cpf')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      const control = this.pessoaForm.get('cpf');
      if (control && value && /[^\d]/.test(value)) { 
        const onlyDigits = value.replace(/\D/g, '');
        control.setValue(onlyDigits, { emitEvent: false, onlySelf: true });
      }
    });
  
  }

  initForm(): void { 

    this.pessoaForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      fisicaJuridica: ['F', Validators.required],
      situacao: [this.situacoes[0].valor, Validators.required],
      tipoPessoaId: [null, Validators.required], // Corrigido de tipoPessoa para tipoPessoaId

      // Campos Pessoa Física
      cpf: [''], 
      sexo: [null],
      estadoCivil: [null],
      dataNascimento: [],
      nomeMae: [''],
      nomePai: [''],
      observacao: [''],

      // Campos Pessoa Jurídica
      cnpj: [''],
      nomeFantasia: [''],
      objetoSocial: [''],
      microEmpresa: ['N'],
      tipoEmpresa: [null]
    });
  }

  // --- NOVO MÉTODO PARA CARREGAR DADOS DA PESSOA ---
  carregarDadosPessoaParaEdicao(id: number): void {
    this.isLoadingDados = true;

    this.pessoaApiService.getPessoaCompletaById(id)
    .then((pessoa: PessoaApiOut) => {
      //console.log('Dados da API para edição:', pessoa);

      const tipoPessoaApi = pessoa.fisicaJuridica;
      this.pessoaForm.get('fisicaJuridica')?.setValue(tipoPessoaApi);

      let dataParaFormulario: any = { ...pessoa };

      // 1. Converte 'situacao' (number) para string
      if (pessoa.situacaoId !== undefined && pessoa.situacaoId !== null) {
        dataParaFormulario.situacao = pessoa.situacaoId.toString();
      }

      if (tipoPessoaApi === 'F') {
        if (pessoa.estadoCivilId !== undefined && pessoa.estadoCivilId !== null) {
          dataParaFormulario.estadoCivil = pessoa.estadoCivilId.toString();
        }

        // A sua lógica de data de nascimento está correta
        if (pessoa.dataNascimento) {
          const parts = pessoa.dataNascimento.split('-');
          if (parts.length === 3) {
            dataParaFormulario.dataNascimento = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          }
        }
      } else {
        if (pessoa.tipoEmpresa !== undefined && pessoa.tipoEmpresa !== null) {
          dataParaFormulario.tipoEmpresa = pessoa.tipoEmpresa.toString();
        }
        
      }

      this.pessoaForm.patchValue(dataParaFormulario);

      console.log('Estado do formulário após patchValue:', tipoPessoaApi,' ',pessoa.cpf);

      if (tipoPessoaApi === 'F' && pessoa.cpf) {
        setTimeout(() => {
          this.cpfInputRef.nativeElement.value = this.formatarCpfParaDisplay(pessoa.cpf);
        }, 0);
      } else {
        setTimeout(() => {
          console.log('ENTROU NO ELSE :', tipoPessoaApi,' ',pessoa.cnpj);
          this.cnpjInputRef.nativeElement.value = this.formatarCnpjParaDisplay(pessoa.cnpj);
        }, 0);
      }

    })
    .catch(error => {
      console.error(`Erro ao carregar dados da pessoa com ID ${id}:`, error);
      this.showToast('Erro ao carregar dados do perfil.', 'Erro', 'danger');
    })
    .finally(() => {
      this.isLoadingDados = false;
    });
  }

  // -------------------------------------------------

  carregarTiposPessoas() {
    this.tipoPessoaService.listAll()
      .then(tipos => {
        this.tiposPessoas = tipos; // Atribuição continua aqui
      })
      .catch(error => {
        console.error("Erro ao carregar tipos pessoas:", error);
    });
  }

  isPessoaFisica(): boolean { return this.pessoaForm.get('fisicaJuridica')?.value === 'F'; }
  isPessoaJuridica(): boolean { return this.pessoaForm.get('fisicaJuridica')?.value === 'J'; }

  onSubmit(): void {
    const dadosFormulario = this.pessoaForm.value;

    const pessoaParaSalvar: PessoaApiIn = {
      // 1. Base do formulário
      ...dadosFormulario,

      // 2. CORREÇÕES ESSENCIAIS
      id: this.modoEdicao ? this.pessoaId : null,
      fisicaJuridica: this.isPessoaFisica() ? 'F' : 'J', // <<< RESOLVE O ERRO PRINCIPAL
      situacao: +dadosFormulario.situacao,
      tipoPessoaId: +dadosFormulario.tipoPessoaId,
      estadoCivil: dadosFormulario.estadoCivil ? +dadosFormulario.estadoCivil : null, // <<< EVITA O PRÓXIMO ERRO

      // 3. Sua lógica original
      ...(this.isPessoaFisica() && {
        cnpj: null, nomeFantasia: null, objetoSocial: null, microEmpresa: null, tipoEmpresa: null,
      }),
      ...(this.isPessoaJuridica() && {
        cpf: null, sexo: null, estadoCivil: null, dataNascimento: null, nomeMae: null, nomePai: null,
      }),
    };

    //console.log('OBJETO FINAL CORRIGIDO SENDO ENVIADO PARA A API:', pessoaParaSalvar);

    if (this.modoEdicao && this.pessoaId) {
      // ATUALIZAR
      this.pessoaApiService.updatePessoa(pessoaParaSalvar).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (pessoaAtualizada: PessoaApiOut) => {
          this.pessoaContextService.setPessoaNome(pessoaAtualizada.nome);
          
          let dataNascimentoFormatada: Date | null = null;
          if (pessoaAtualizada.dataNascimento) {
             const parts = pessoaAtualizada.dataNascimento.split('-');
             if (parts.length === 3) {
                 dataNascimentoFormatada = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
             }
          }

          console.log('COMO ESTA AQUI >>>>>>>>>>>>>>>>:', pessoaAtualizada);

          let cpfFormatadoParaDisplay = pessoaAtualizada.cpf;
          if (pessoaAtualizada.cpf && pessoaAtualizada.cpf.length <= 11) {
            cpfFormatadoParaDisplay = this.formatarCpfParaDisplay(pessoaAtualizada.cpf);
          } else {
            let cnpjFormatadoParaDisplay = pessoaAtualizada.cnpj;
            cnpjFormatadoParaDisplay = this.formatarCnpjParaDisplay(cnpjFormatadoParaDisplay);
          }

          this.pessoaForm.patchValue({
            //...pessoaAtualizada,
            dataNascimento: dataNascimentoFormatada
          });


          if (cpfFormatadoParaDisplay) {
            setTimeout(() => {
              // Adiciona a verificação AQUI DENTRO, no momento exato da execução.
              if (this.cpfInputRef && this.cpfInputRef.nativeElement) {
                this.cpfInputRef.nativeElement.value = cpfFormatadoParaDisplay;
              }
            }, 0);
          }


          this.showToast('Pessoa atualizada com sucesso!', 'Sucesso', 'success');
        },
        error: (erro) => {
          console.error('Erro ao atualizar pessoa:', erro);
          const mensagemErro = erro.error?.message || erro.message || 'Erro desconhecido ao atualizar pessoa.';
          this.toastrService.danger(mensagemErro, 'Falha na Atualização');
        }
      });
    } else {
      // CRIAR
      this.pessoaApiService.createPessoa(pessoaParaSalvar).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false) 
      ).subscribe({
        next: (pessoaCadastrada: PessoaApiOut) => {
          this.pessoaId = pessoaCadastrada.id;
          //console.log('Pessoa cadastrada com ID:', this.pessoaId);
          this.showToast('Pessoa inserida com sucesso!', 'Sucesso', 'success');

          if (pessoaCadastrada.id) {
            this.pessoaContextService.setPessoaId(pessoaCadastrada.id);
          }
          this.pessoaContextService.setPessoaNome(pessoaCadastrada.nome);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar pessoa:', erro);
          const mensagemErro = erro.error?.message || erro.message || 'Erro desconhecido ao cadastrar pessoa.';
          this.toastrService.danger(mensagemErro, 'Falha no Cadastro');
        }
      });
    }
  }

  formatarCpfParaDisplay(cpfNumeros: string): string {
    if (!cpfNumeros || cpfNumeros.length !== 11) {
      return cpfNumeros; // Retorna original se não for um CPF válido para formatação
    }
    return `${cpfNumeros.substring(0, 3)}.${cpfNumeros.substring(3, 6)}.${cpfNumeros.substring(6, 9)}-${cpfNumeros.substring(9, 11)}`;
  }

  formatarCnpjParaDisplay(cnpjNumeros: string): string {
    console.log('chegou na função ', cnpjNumeros);
    if (!cnpjNumeros || cnpjNumeros.length !== 14) { 
      return cnpjNumeros; // Retorna original se não for um CNPJ válido para formatação
    }
    const cnpjFormtado = `${cnpjNumeros.substring(0, 2)}.${cnpjNumeros.substring(2, 5)}.${cnpjNumeros.substring(5, 8)}/${cnpjNumeros.substring(8, 12)}-${cnpjNumeros.substring(12, 14)}`;
    console.log('Retuen  ', cnpjFormtado);
    return cnpjFormtado;
  }

  onCancelar(): void {
    // Volta para a pesquisa geral de pessoas
    this.router.navigate(['/pages/pessoas-api/pessoa-api-pesquisa']);
  }

  getControl(name: string): AbstractControl | null { return this.pessoaForm.get(name); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showToast(message: string, title: string, status: 'success' | 'danger' | 'warning' | 'info'): void {
    this.toastrService.show(message, title, {
      status,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000
    });
  }
}