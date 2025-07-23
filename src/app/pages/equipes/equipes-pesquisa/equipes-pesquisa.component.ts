import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';
//Nao apagar este
import { LocaisCompeticoesSelectModule } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.module';
import { EquipesService } from '../equipes.service';
import { Equipe } from '../../../shared/models/equipe';
import { EquipesIudComponent } from '../equipes-iud/equipes-iud.component';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete-modal.component';
import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-equipes-pesquisa',
  templateUrl: './equipes-pesquisa.component.html',
  styleUrls: ['./equipes-pesquisa.component.scss']
})

export class EquipesPesquisaComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  equipes: any[] = [];
  
  settings = {
    mode: 'external',

    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      //width: '40px',
      addMode: 'edit'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
        width: '20px',
      },

      empresa: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (empresa) => {
          return empresa.value = 1;
        },
      },

      modalidadeNome: {
        title: 'Modalidade',
        type: 'string',
        width: '100px',
      },

      nome: {
        title: 'Nome',
        type: 'string',
        width: '200px',
      },

      sigla: {
        title: 'Sigla',
        type: 'string',
        width: '50px',
      },

      agremiacao: {
        title: 'Agremiação',
        type: 'object', 
        valuePrepareFunction: (agremiacao) => {
          return agremiacao ? agremiacao.nome : ''; // Retorna agremiacao.nome ou uma string vazia se agremiacao for null ou undefined
        },
      },

      tecnico: {
        title: 'Técnico',
        type: 'object',
        valuePrepareFunction: (tecnico) => {
          return tecnico ? tecnico.nome : ''; // Retorna tecnico.nome ou uma string vazia se tecnico for null ou undefined
        },
      },
    }
  }

  constructor(private equipeService: EquipesService, 
    private windowService: NbWindowService,
    // vai sair
    private campeonatosService: CampeonatosService, 
    private router: Router,
    private routeActive: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
    ) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }

  ngOnInit(): void {

    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.aoMudarPagina(change.paging.page);
      }
    });

  }

  listar() {
    this.equipeService.pesquisar(this.filtro)
      .then(response => {
        const equipes = response.equipes;
        this.source.load(equipes);
      });
  }

  onAdd() {
    this.abrirModalAddEquipe();
  }

  async abrirModalAddEquipe() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: true,
      close: true
    };

    this.windowService.open(EquipesIudComponent, {
      title: `Cadastrar Equipe`,
      buttons: buttonsConfig,
      context: { mode: 'add' },
      closeOnBackdropClick: false // Impede que o diálogo feche ao clicar fora
    }).onClose.subscribe((reason: string | undefined) => {
      if (reason === 'atualizado' || reason === 'save') {
        this.listar();

        this.toastrService.show(
          'Nova equipe cadastrada com sucesso!',
          'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
      }
    });
  }

  onEdit(event) {
    this.abrirModalEditarEquipe(event.data.id); 
  }

  async abrirModalEditarEquipe(id: number) {

    try {
      const equipeCompleta: Equipe = await this.equipeService.getEquipeById(id);

      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      this.windowService.open(EquipesIudComponent, {
        title: `Editar Equipe`,
        buttons: buttonsConfig,
        context: { equipe: equipeCompleta, mode: 'edit' },

        closeOnBackdropClick: false // Impede que o diálogo feche ao clicar fora

      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado' || reason === 'save') {
          this.listar();

          // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
          this.toastrService.show(
            `Equipe "${equipeCompleta.nome}" foi atualizado com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          ); 
        }
      });
    } catch (error) {
      this.showToast('ERRO ao tentar alterar equipe!', 'danger'); 
      console.error("Erro ao buscar equipe por ID:", error);
      // Trate o erro adequadamente
    }
  }

  onDelete(event): void {

    const campeonatoParaExcluir = event.data;
    
    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Mensagem dinâmica para melhorar a experiência do usuário
        message: `Você tem certeza que deseja excluir a equipe <strong>"${campeonatoParaExcluir.nome}"</strong>?`,
        confirmButtonText: 'Sim, Excluir',
        cancelButtonText: 'Cancelar',
        status: 'danger',
        icon: 'trash-2-outline'
      },
      closeOnBackdropClick: false // Impede que o diálogo feche ao clicar fora
    }).onClose.subscribe(confirmado => {
      // 'confirmado' será true se o usuário clicar em "Sim, Excluir"
      if (confirmado) {
        // Se confirmado, executa a lógica de exclusão
        this.equipeService.delete(campeonatoParaExcluir.id)
          .subscribe({
            next: () => {
              // Atualiza a tabela com os dados mais recentes
              this.listar();
              //event.confirm.resolve(); // Notifica a ng2-smart-table que a operação foi bem-sucedida

              // Dispara o toast de sucesso
              this.toastrService.show(
                `Equipe "${campeonatoParaExcluir.nome}" foi excluída com sucesso.`,
                'Exclusão Realizada',
                { status: 'success', icon: 'trash-2-outline' }
              );
            },
            error: (error) => {
              console.error('Erro ao deletar etapa:', error);
              event.confirm.reject(); // Notifica a ng2-smart-table que a operação falhou

              // Dispara o toast de erro
              this.toastrService.show(
                'Não foi possível excluir a equipe. Verifique se ele não está sendo usado em outras partes do sistema.',
                'Erro na Exclusão',
                { status: 'danger', icon: 'alert-circle-outline' }
              );
            }
          });
      } else {
        // Se o usuário clicou em "Cancelar" ou fechou o diálogo
        console.log('Usuário cancelou a exclusão.');
        event.confirm.reject(); // Notifica a ng2-smart-table que a operação foi cancelada
      }
    });

  }


  aoMudarPagina(pageIndex) {
    const loadedRecordCount = this.filtro.totalRegistros
    const lastRequestedRecordIndex = pageIndex * this.filtro.itensPorPagina;

    if (loadedRecordCount <= lastRequestedRecordIndex) {
      let myFilter; 
      myFilter.startIndex = loadedRecordCount + 1;

      this.equipeService.pesquisar(myFilter) //.toPromise()
        .then(data => {
          if (this.source.count() > 0) {
            data.forEach(d => this.source.add(d));
            this.source.getAll()
              .then(d => this.source.load(d))
          }
          else
            this.source.load(data);
      })
    }
  }

  showToast(message: string, status: string) {
    const config: Partial<NbToastrConfig> = {
      status: status,
      duration: 3000,
      preventDuplicates: true,
    };
    this.toastrService.show(message, '', config);
  }
}

