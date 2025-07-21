import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';

import { PontuacaoService } from '../pontuacao.service';
import { HttpParams, HttpClient } from '@angular/common/http';

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

  constructor(private service: PontuacaoService, private _http: HttpClient, 
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

  onCreateConfirm(event) {
    event.newData.empresa = 1;

    this.service.create(event.newData)
      .subscribe(
          () => {
              this.listar();
              event.confirm.resolve();
          },
          error => console.error('Erro ao criar pontuacao:', error)
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
      },
      error => console.error('Erro ao editar pontuacao:', error)
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Voce deseja deletar este item?')) {
      const id = event.data.id; // Obter o ID da modalidade a ser deletada

      this.service.delete(id)
        .subscribe(
          () => {
            // Atualiza a tabela com os dados mais recentes
            this.listar();
            event.confirm.resolve();
          },
          error => console.error('Erro ao deletar pontuacao:', error)
        );
    } else {
      event.confirm.reject();
    }
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