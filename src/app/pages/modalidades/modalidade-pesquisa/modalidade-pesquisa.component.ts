import { Component, OnInit } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpParams } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ModalidadesService } from '../modalidades.service';
//import { ModalidadesFiltro } from '../modalidades-filtro';
import { HttpClient } from '@angular/common/http';
import { Filters } from '../../../shared/filters/filters';

@Component({
  selector: 'ngx-modalidade-pesquisa',
  templateUrl: './modalidade-pesquisa.component.html',
  styleUrls: ['./modalidade-pesquisa.component.scss'],
})

export class ModalidadePesquisaComponent implements OnInit {
  selectedRows: any;

  filtro: Filters = new Filters();

  source: LocalDataSource = new LocalDataSource();
  //pageSize = 25;
  //totalRegistros: number = 0;

  settings = {

    pager: {
      display: true, // Exibe o paginador
      perPage: 5,
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      addMode: 'edit'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit',
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
        filter: false,
        width: '20px',
      },
      nome: {
        title: 'Nome',
        type: 'string',
        width: '250px',
        filter: false
        },
      descricao: {
        title: 'Descrição',
        type: 'string',
        width: '700px',
        filter: false
      },
    },
  };

  /*data = [
    // ... our data here
  ];*/

  ngOnInit(): void {
    // Apenas um comentário para satisfazer a regra de lint 'no-empty-lifecycle-method'.
  }

  constructor(private service: ModalidadesService, private _http: HttpClient, 
      private router: Router,
      private routeActive: ActivatedRoute) {
      this.source = new ServerDataSource(this._http, {
        dataKey: 'content',
        endPoint: 'http://localhost:8080/tiposModalidades/filter',
        pagerPageKey: 'page',
        pagerLimitKey: 'size',
        totalKey: 'totalElements',
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Voce deseja deletar este item?')) {
      const id = event.data.id; // Obter o ID da modalidade a ser deletada

      this.service.delete(id)
        .subscribe(
          () => {
            event.confirm.resolve();
          },
          error => console.error('Erro ao deletar modalidade:', error)
        );
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    this.service.update(event.newData)
      .subscribe(
        () => {
          event.confirm.resolve();
        },
        error => console.error('Erro ao editar modalidade:', error)
    );
  }

  onCreateConfirm(event) {
    this.service.create(event.newData)
      .subscribe(
        () => {
          event.confirm.resolve();
        },
        error => console.error('Erro ao criar modalidade:', error)
    );
  }

  onRowSelect(event) {
    this.selectedRows = event.selected;
  }

  onSearch(query: string = '') {
    let params = new HttpParams();

    params = this.filtro.params.append('id', 26)

    console.log('onSearch ', query, ' ', params)
    
    this.service.pesquisar({...this.filtro, params: params})
    .then(response => {
        const modalidades = response.modalidades
        console.log('RETRONOU DO FILTRO ', modalidades)
        this.source.load(modalidades); // Carrega os dados na tabela
        
      });

    this.source.setFilter([

      {
        field: 'id',
        search: query
      },
      /*{
        field: 'name',
        search: query
      }*/
    ], false); 
  }
}
