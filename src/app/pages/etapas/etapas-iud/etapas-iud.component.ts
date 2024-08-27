
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { EtapasService } from '../etapas.service';
import { CheckboxYesNoComponent } from '../../../components/CheckboxYesNoComponent';
import { DatepickerComponent } from '../../forms/datepicker/datepicker.component';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';

@Component({
  selector: 'ngx-etapas-iud',
  templateUrl: './etapas-iud.component.html',
  styleUrls: ['./etapas-iud.component.scss']
})

export class EtapasIudComponent implements OnInit {

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
      empresa: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (empresa) => {
          return empresa.value = 1;
        },
      },
      nome: {
        title: 'Nome',
        type: 'string',
      },
      dataEtapa: {
        filter: false,
        title: 'Data Etapa',
        type: 'date',
        //renderComponent: DataEditorRenderComponent,
        /*editor: {
          type: 'custom',
          component: DataEditorComponent,
        },*/
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
      
      dataInscricao: {
        filter: false,
        title: 'Data Inscrição',
        type: 'date',
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

      pontua: {
        title: 'Pontua',
        filter: false,
        type: 'string',
        editor: {
          type: 'custom',
          component: CheckboxYesNoComponent // O componente do checkbox
        },
        valuePrepareFunction: (value) => {
          // Formata 'S' para 'Sim' e 'N' para 'Não'
          return value === 'S' ? 'Sim' : 'Não';
        }
      },

      acumula: {
        title: 'Acumula',
        filter: false,
        type: 'string',
        editor: {
          type: 'custom',
          component: CheckboxYesNoComponent // O componente do checkbox
        },
        valuePrepareFunction: (value) => {
          // Formata 'S' para 'Sim' e 'N' para 'Não'
          return value === 'S' ? 'Sim' : 'Não';
        }
      },

      tipoPiscina: {
        title: 'Tipo Piscina',
        filter: false,
        type: 'string',
        editor: {
          type: 'custom',
          component: CheckboxYesNoComponent // O componente do checkbox
        },
        valuePrepareFunction: (value) => {
          // Formata 'S' para 'Sim' e 'N' para 'Não'
          return value === 'C' ? 'Curta' : 'Longa';
        }
      },

      descricao: {
        title: 'Desrição',
        type: 'string',
      },
    }
  }

  source: LocalDataSource = new LocalDataSource();
  filtro = new Filters();
  dateService: any;
  selectedCampeonatoId: number;
  campeonatos: any[] = [];

  constructor(private etapasService: EtapasService, 
      private campeonatosService: CampeonatosService,        

    private router: Router,
    private routeActive: ActivatedRoute) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }
  
  ngOnInit(): void {
    
    this.campeonatosService.listAllList()
    .then(campeonatos => {
        // Se campeonatos for um array com um único elemento
        this.campeonatos = [...campeonatos];
    })
    .catch(error => console.error('Erro ao obter lista de campeonatos:', error));

    this.listar();
  }

  onCampeonatoChange(campeonatoId: number) {
    this.selectedCampeonatoId = campeonatoId;
    console.log('no on change ' , this.selectedCampeonatoId )
    this.listar(); // Chama a função para atualizar a tabela após a seleção
  }

  listar(pagiana = 0) {
    this.filtro.pagina = pagiana;

    // Se selecionado um campeonato, filtrar a lista de etapas
    if (this.selectedCampeonatoId) {
      console.log('Campeonato ', this.selectedCampeonatoId)
      this.etapasService.pesquisar({ ...this.filtro, campeonatoId: this.selectedCampeonatoId })
        .then(response => {
          const etapas = response.etapas;
          this.source.load(etapas);
        });
    } else { // Caso contrário, listar todas as etapas
      this.etapasService.pesquisar(this.filtro)
        .then(response => {
          const etapas = response.etapas;
          this.source.load(etapas);
        });
    }
  }

  onCreateConfirm(event) {
    event.newData.empresa = 1;

    this.etapasService.create(event.newData)
      .subscribe(
      () => {
        this.listar();
        event.confirm.resolve();
      },
      error => console.error('Erro ao criar etapa:', error)
    );
  }

  onSaveConfirm(event) {
    this.etapasService.update(event.newData)
      .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();
      },
      error => console.error('Erro ao editar etapa:', error)
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Voce deseja deletar este item?')) {
      const id = event.data.id; // Obter o ID da modalidade a ser deletada

      this.etapasService.delete(id)
        .subscribe(
          () => {
            // Atualiza a tabela com os dados mais recentes
            this.listar();
            event.confirm.resolve();
          },
          error => console.error('Erro ao deletar etapa:', error)
        );
    } else {
      event.confirm.reject();
    }
  }

  onSearch(query: string = '') {

    console.log(query)

  }

}

