import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';

import { CampeonatosService } from '../campeonatos.service';
import { CampeonatosFiltro } from '../campeonatos-filter';
import { ModalidadeSelectComponent } from '../../modalidades/modalidade-select/ModalidadesSelectComponent';

@Component({
  selector: 'ngx-campeonatos-pesquisa',
  templateUrl: './campeonatos-pesquisa.component.html',
  styleUrls: ['./campeonatos-pesquisa.component.scss']
})

export class CampeonatosPesquisaComponent implements OnInit {
  
  //selectedModalidade: number = null;
  //selectedRows: any;

  public settings = {
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
        title: 'Modalidade',
        type: 'number',
        editor:{
          type: 'custom',
          component: ModalidadeSelectComponent
        },
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
    defaultValues: {
      modalidade: null // Define o valor inicial para a coluna modalidade
    },
  };

  source: LocalDataSource = new LocalDataSource();
  filtro: CampeonatosFiltro = new CampeonatosFiltro();

  ngOnInit(): void {
    this.listar();
  }

  constructor(private service: CampeonatosService, 

    private router: Router,
    private routeActive: ActivatedRoute) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
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

    console.log('1 ',event.newData )

    this.service.create(event.newData)
      .subscribe(
          () => {
              this.listar();
              event.confirm.resolve();
          },
          error => console.error('Erro ao criar modalidade:', error)
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
      error => console.error('Erro ao editar campeonato:', error)
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
          error => console.error('Erro ao deletar campeonato:', error)
        );
    } else {
      event.confirm.reject();
    }
  }

  onCustomAction(event) {
    console.log('Custon action:', event.selected);
  }
}
