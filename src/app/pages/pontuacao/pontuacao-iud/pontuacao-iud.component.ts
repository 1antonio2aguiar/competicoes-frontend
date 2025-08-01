import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';

import { PontuacaoService } from '../pontuacao.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-pontuacao-iud',
  templateUrl: './pontuacao-iud.component.html',
  styleUrls: ['./pontuacao-iud.component.scss']
})

export class PontuacaoIudComponent implements OnInit {
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
      width: '40px',
      addMode: 'edit',
    },

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit',
      mode: 'edit'
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
        filter: true,
        width: '20px',
      },
      
      classificacao: {
        title: 'Classificação',
        type: 'string',
        filter: true,
        width: '800px',
      },
      pontos: {
        title: 'Pontos',
        type: 'string',
        width: '100px',
      },
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
    private service: PontuacaoService, 
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private _http: HttpClient, 
    private router: Router,
    private routeActive: ActivatedRoute) {
  }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const pontuacao = response.pontuacao;
        this.source.load(pontuacao);
      })
      .catch(error => {
        console.error("Erro ao listar pontuações:", error);
      });
  }

  onSaveConfirm(event) {
    this.service.update(event.newData)
    .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
          this.toastrService.show(
            `Pontuação "${event.newData.classificacao}" foi atualizada com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          );
        },
        error => console.error('Erro ao editar pontuacao:', error)
    );
  }

  onCreateConfirm(event) {
    event.newData.empresa = 1;
    this.service.create(event.newData)
      .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          this.toastrService.show(
            'Nova pontuação cadastrada com sucesso!',
            'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
      },
      error => console.error('Erro ao criar Pontuacao:', error)
    );
  }

  onDeleteConfirm(event): void {
      const pontuacaoParaExcluir = event.data;
      
      // Abre o componente de diálogo reutilizável
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          title: 'Confirmar Exclusão',
          // Mensagem dinâmica para melhorar a experiência do usuário
          message: `Você tem certeza que deseja excluir a pontuação <strong>"${pontuacaoParaExcluir.classificacao}"</strong>?`,
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
          this.service.delete(pontuacaoParaExcluir.id)
            .subscribe({
              next: () => {
                // Atualiza a tabela com os dados mais recentes
                this.listar();
                event.confirm.resolve(); // Notifica a ng2-smart-table que a operação foi bem-sucedida
  
                // Dispara o toast de sucesso
                this.toastrService.show(
                  `Pontuação "${pontuacaoParaExcluir.classificacao}" foi excluída com sucesso.`,
                  'Exclusão Realizada',
                  { status: 'success', icon: 'trash-2-outline' }
                );
              },
              error: (error) => {
                console.error('Erro ao deletar pontuacao:', error);
                event.confirm.reject(); // Notifica a ng2-smart-table que a operação falhou
  
                // Dispara o toast de erro
                this.toastrService.show(
                  'Não foi possível excluir o pontuacao. Verifique se ele não está sendo usado em outras partes do sistema.',
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
    let classificacaoFilter = filtersArray.find(f => f.field === 'classificacao');

    if (idFilter && idFilter.search) {
      params = params.set('id', idFilter.search);
    }
    if (classificacaoFilter && classificacaoFilter.search) {
      params = params.set('classificacao', classificacaoFilter.search);
    }

    this.filtro.params = params;

    this.service.pesquisar({...this.filtro, params: params})
      .then(response => {
        const pontuacao = response.pontuacao;
        this.source.load(pontuacao); // Carrega os dados na tabela
      });
  }

  // Aqui filtra pelo input.
  onSearch(query: string = '') {
      let params = new HttpParams();

      let isId = !isNaN(Number(query)); // Verifica se a query é um número (ID)
      //let isString = /[a-zA-Z]/.test(query);
    
    if (isId) {
      params = this.filtro.params.append('id', query)
      console.log('onSearch ', query, ' ', params)
    }

    let isString = isNaN(Number(query)) && query.length > 0;
    if(isString){
      params = this.filtro.params.append('classificacao', query)
    }
      
      this.service.pesquisar({...this.filtro, params: params})
      .then(response => {
          const pontuacao = response.pontuacao
          //console.log('RETRONOU DO FILTRO ', pontuacao)
          this.source.load(pontuacao); // Carrega os dados na tabela
          
    });
  }
}