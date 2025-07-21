import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';

import { CampeonatosService } from '../campeonatos.service';
import { ModalidadeSelectComponent } from '../../modalidades/modalidade-select/ModalidadesSelectComponent';
import { Filters } from '../../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-campeonatos-pesquisa',
  templateUrl: './campeonatos-pesquisa.component.html',
  styleUrls: ['./campeonatos-pesquisa.component.scss']
})

export class CampeonatosPesquisaComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();

  public settings = {
    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      addMode: 'edit',
      addColumns: ['modalidade', 'nome', 'descricao'],
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit',
      mode: 'edit', // Define o modo de edição como inline
      editColumns: ['nome', 'descricao'] // Desabilita a edição da coluna 'modalidade'
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
        width: '30px',
        filter: true,
      },
      empresa: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (empresa) => {
          return empresa.value = 1;
        },
      },
      modalidade: {
        filter: true,
        title: 'Modalidade',
        type: 'number',
        editor: {
          type: 'custom',
          component: ModalidadeSelectComponent
        },
        valuePrepareFunction: (value) => {
          return value.nome ? value.nome : 'Erro';
        }
      },

      nome: {
        title: 'Nome',
        type: 'string',
      },
      descricao: {
        title: 'Descrição',
        type: 'string',
        filter: true,
      },
    },
    defaultValues: {
      modalidade: null // Define o valor inicial para a coluna modalidade
    },
  };

  ngOnInit(): void {
    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  constructor(
    private service: CampeonatosService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {

  }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const campeonatos = response.campeonatos;
        this.source.load(campeonatos);
      });
  }

  onCreateConfirm(event) {
    event.newData.empresa = 1;

    this.service.create(event.newData)
      .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          this.toastrService.show(
            'Novo campeonato cadastrado com sucesso!',
            'Cadastro Realizado',
            { status: 'success', icon: 'checkmark-circle-outline' }
          );

        },
        error => console.error('Erro ao criar campeonato:', error)
      );
  }

  onSaveConfirm(event) {
    this.service.update(event.newData)
      .subscribe(
        () => {
          // Atualiza a tabela e fecha o modal de edição
          this.listar();
          event.confirm.resolve();
          // O ng2-smart-table gerencia a atualização do estado de edição

          // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
          this.toastrService.show(
            `Campeonato "${event.newData.nome}" foi atualizado com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          );

        },
        error => console.error('Erro ao editar campeonato:', error)
      );
  }

  onDeleteConfirm(event): void {
    const campeonatoParaExcluir = event.data;

    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Mensagem dinâmica para melhorar a experiência do usuário
        message: `Você tem certeza que deseja excluir o campeonato <strong>"${campeonatoParaExcluir.nome}"</strong>?`,
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
        this.service.delete(campeonatoParaExcluir.id)
          .subscribe({
            next: () => {
              // Atualiza a tabela com os dados mais recentes
              this.listar();
              event.confirm.resolve(); // Notifica a ng2-smart-table que a operação foi bem-sucedida

              // Dispara o toast de sucesso
              this.toastrService.show(
                `O campeonato "${campeonatoParaExcluir.nome}" foi excluído com sucesso.`,
                'Exclusão Realizada',
                { status: 'success', icon: 'trash-2-outline' }
              );
            },
            error: (error) => {
              console.error('Erro ao deletar campeonato:', error);
              event.confirm.reject(); // Notifica a ng2-smart-table que a operação falhou

              // Dispara o toast de erro
              this.toastrService.show(
                'Não foi possível excluir o campeonato. Verifique se ele não está sendo usado em outras partes do sistema.',
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

  // Aqui filtra pelo campo de busca do ng2 smart teble
  // Nova função para lidar com os filtros da tabela
  onTableFilter(filters: any) {
    let params = new HttpParams();

    // Garante que filters seja um array
    let filtersArray = (filters && filters.filters && Array.isArray(filters.filters)) ? filters.filters : [];

    let idFilter = filtersArray.find(f => f.field === 'id');
    let nomeFilter = filtersArray.find(f => f.field === 'nome');

    if (idFilter && idFilter.search) {
      params = params.set('id', idFilter.search);
    }
    if (nomeFilter && nomeFilter.search) {
      params = params.set('nome', nomeFilter.search);
    }
    this.filtro.params = params;

    this.service.pesquisar({ ...this.filtro, params: params })
      .then(response => {
        const campeonatos = response.campeonatos;
        this.source.load(campeonatos);
      });
  }
}
