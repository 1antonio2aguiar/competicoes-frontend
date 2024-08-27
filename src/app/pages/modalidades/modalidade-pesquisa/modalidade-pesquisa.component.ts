import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalidadesService } from '../modalidades.service';
import { ModalidadesFiltro } from '../modalidades-filtro';
import { Modalidade } from '../../../shared/models/modalidade';

import { ModalidadeData } from '../../../@core/data/modalidade';

//https://stackblitz.com/edit/example-ng2-smart-table-18qsws?file=src%2Fapp%2Fapp.component.ts

@Component({
  selector: 'ngx-modalidade-pesquisa',
  templateUrl: './modalidade-pesquisa.component.html',
  styleUrls: ['./modalidade-pesquisa.component.scss'],
})

export class ModalidadePesquisaComponent implements OnInit {
  selectedRows: any;

  settings = {
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
      },
      nome: {
        title: 'Nome',
        type: 'string',
      },
      descricao: {
        title: 'Descrição',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  filtro: ModalidadesFiltro = new ModalidadesFiltro();

  ngOnInit(): void {
    this.listar();
  }

  constructor(private service: ModalidadesService,
    private router: Router,
    private routeActive: ActivatedRoute) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const modalidades = response.modalidades;
        this.source.load(modalidades);
      });
  }

  /*onSaveConfirm(event) {
    console.log("aqui passou!!!")
    // Verifica se o usuário está editando ou criando
    const isCreating = event.editing === true;
  
    // Se estiver criando (evento de adição)
    if (isCreating) {
      this.service.create(event.newData)
        .subscribe(
          () => {
            // Atualiza a tabela com os dados mais recentes
            this.listar();
            event.confirm.resolve();
            // O ng2-smart-table gerencia a atualização do estado de edição
          },
          error => console.error('Erro ao criar modalidade:', error)
        );
    } else {
      // Caso seja edição, usa o método update
      this.service.update(event.newData)
        .subscribe(
          () => {
            // Atualiza a tabela e fecha o modal de edição
            this.listar();
            event.confirm.resolve();
            // O ng2-smart-table gerencia a atualização do estado de edição
          },
          error => console.error('Erro ao editar modalidade:', error)
        );
    }
  }*/


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
            error => console.error('Erro ao deletar modalidade:', error)
          );
      } else {
        event.confirm.reject();
      }
    }

  onSaveConfirm(event) {
    console.log("Edit Event In Console")
    console.log(event);

    this.service.update(event.newData)
    .subscribe(
      () => {
        // Atualiza a tabela e fecha o modal de edição
        this.listar();
        event.confirm.resolve();
        // O ng2-smart-table gerencia a atualização do estado de edição
      },
      error => console.error('Erro ao editar modalidade:', error)
    );
  }

  onCreateConfirm(event) {
    console.log("Create Event In Console")
    console.log(event);

    this.service.create(event.newData)
    .subscribe(
      () => {
        // Atualiza a tabela com os dados mais recentes
        this.listar();
        event.confirm.resolve();
        // O ng2-smart-table gerencia a atualização do estado de edição
      },
      error => console.error('Erro ao criar modalidade:', error)
    );

  }

  
  // Get Selected button click handler
  onClick() {
    // It will console all the selected rows
    console.log(this.selectedRows);
  }

  onRowSelect(event) {
    this.selectedRows = event.selected;
  }


}
