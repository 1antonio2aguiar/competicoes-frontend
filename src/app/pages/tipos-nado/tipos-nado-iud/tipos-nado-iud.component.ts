import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';

import { TiposNadoService } from '../tipos-nado.service';

@Component({
  selector: 'ngx-tipos-nado-iud',
  templateUrl: './tipos-nado-iud.component.html',
  styleUrls: ['./tipos-nado-iud.component.scss']
})

export class TiposNadoIudComponent implements OnInit {
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
        width: '20px',
      },
      
      descricao: {
        title: 'Descrição',
        type: 'string',
        width: '900px',
      },
    },
  };

  ngOnInit(): void {
    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.aoMudarPagina(change.paging.page);
      }
    });
  }

  constructor(private service: TiposNadoService, 

    private router: Router,
    private routeActive: ActivatedRoute) {
  }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const tiposNado = response.tiposNado;
        this.source.load(tiposNado);
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
          error => console.error('Erro ao criar tipo nado:', error)
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
      error => console.error('Erro ao editar Tipo Nado:', error)
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
          error => console.error('Erro ao deletar tipo nado:', error)
        );
    } else {
      event.confirm.reject();
    }
  }

  aoMudarPagina(pageIndex) {
    const loadedRecordCount = this.filtro.totalRegistros
    const lastRequestedRecordIndex = pageIndex * this.filtro.itensPorPagina;

    if (loadedRecordCount <= lastRequestedRecordIndex) {
      let myFilter; 
      myFilter.startIndex = loadedRecordCount + 1;

      this.service.pesquisar(myFilter) //.toPromise()
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

}
