import { Component, OnInit, } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Filters } from '../../../shared/filters/filters';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { DatepickerComponent } from '../date-picker/datepicker.component';
import { CategoriasService } from '../categorias.service';
import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-categorias-iud',
  templateUrl: './categorias-iud.component.html',
  styleUrls: ['./categorias-iud.component.scss'],
  providers: [DatePipe]
})

export class CategoriasIudComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  dataRecebida: (string | null)[] = []; // Inicializa como um array vazio
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
      width: '40px',
      addMode: 'edit',
    },

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit',
      mode: 'inline',
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
        filter: true,
      },

      dataIniCategoria: {
        filter: true,
        title: 'Início',
        type: 'date',
        width: '100px',
          editor: {
              type: 'custom',
              component: DatepickerComponent,
        },
        valuePrepareFunction: (data) => {
          // Formata a data para dd/mm/yyyy
          const date = new Date(data);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        },
      },

    dataFinCategoria: {
        filter: true,
        title: 'Fim',
        type: 'string',
        width: '100px',
        editor: {
            type: 'custom',
            component: DatepickerComponent,
        },
        valuePrepareFunction: (data) => {
          // Formata a data para dd/mm/yyyy
          const date = new Date(data);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        },
    },
      
      descricao: {
        title: 'Descrição',
        type: 'string',
        width: '700px',
        filter: true,
      },
    }
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
    private service: CategoriasService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) { }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const categorias = response.categorias;
        this.source.load(categorias);
      })
      .catch(error => {
        console.error("Erro ao listar categorias:", error);
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
            'Nova categoria cadastrada com sucesso!',
            'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
        },
        error => console.error('Erro ao criar categoria:', error)
    );
  }

  onSaveConfirm(event) {

    const storedArray = JSON.parse(localStorage.getItem('myDateArray') || '[]');
  if (Array.isArray(storedArray)) {
    this.dataRecebida = storedArray;
  } else {
    this.dataRecebida = []; // Garante que seja um array, mesmo que localStorage esteja corrompido
  }

    event.newData.dataIniCategoria = this.dataRecebida[0];
    event.newData.dataFinCategoria = this.dataRecebida[1];

    this.service.update(event.newData)
    .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
          this.toastrService.show(
            `Categoria "${event.newData.descricao}" foi atualizada com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          );
        },
        error => console.error('Erro ao editar categoria:', error)
    );
  }

  onDeleteConfirm(event): void {
    const campeonatoParaExcluir = event.data;
    
    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Mensagem dinâmica para melhorar a experiência do usuário
        message: `Você tem certeza que deseja excluir a cateroria <strong>"${campeonatoParaExcluir.descricao}"</strong>?`,
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
                `Acategoria "${campeonatoParaExcluir.nome}" foi excluída com sucesso.`,
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
      let descricaoFilter = filtersArray.find(f => f.field === 'descricao');
  
      if (idFilter && idFilter.search) {
        params = params.set('id', idFilter.search);
      }
      if (descricaoFilter && descricaoFilter.search) {
        params = params.set('descricao',descricaoFilter.search);
      }
      this.filtro.params = params;
  
      this.service.pesquisar({...this.filtro, params: params})
        .then(response => {
          const categorias = response.categorias;
        this.source.load(categorias);
    });
  }

}
