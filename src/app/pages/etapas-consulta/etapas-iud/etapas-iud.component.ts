
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { EtapasService } from '../etapas.service';
import { DatepickerComponent } from '../../forms/datepicker/datepicker.component';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { HttpParams } from '@angular/common/http';
import { LocaisCompeticoesSelectModule } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.module';
import { ModalidadeSelectComponent } from '../../modalidades/modalidade-select/ModalidadesSelectComponent';
import { LocalCompeticaoSelectComponent } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.component';

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

      campeonato: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (campeonato) => {
          return campeonato.value = 1;
        },
      },

      nome: {
        title: 'Nome',
        type: 'string',
        width: '200px',
      },

      localCompeticao: {
        title: 'Local Competição',
        type: 'number',
        width: '200px',
        editor:{
          type: 'custom',
          component: LocalCompeticaoSelectComponent
        },
        valuePrepareFunction: (value) => {
          return value.nome ? value.nome : 'Erro';
        }
      },

      dataEtapa: {
        filter: true,
        title: 'Etapa',
        type: 'date',
        width: '70px',
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
        filter: true,
        title: 'Inscrição',
        type: 'date',
        width: '70px',
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

      /*pontua: {
        title: 'Pontua',
        filter: false,
        type: 'string',
        editor: {
          type: 'custom',
          component: DropDownPontuaComponent // O componente do checkbox
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
          component: DropDownAcumulaComponent // O componente do checkbox
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
          component: DropDownTipoPiscinaComponent // O componente do checkbox
        },
        valuePrepareFunction: (value) => {
          // Formata 'S' para 'Sim' e 'N' para 'Não'
          return value === 'C' ? 'Curta' : 'Longa';
        }
      },*/

      descricao: {
        title: 'Desrição',
        type: 'string',
      },
    },
    defaultValues: {
      localCompeticao: null, // Define o valor inicial para a coluna modalidade
      tipoPiscina: null,
      acumula: null,
      pontua: null
    },
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
    this.listar(); // Chama a função para atualizar a tabela após a seleção
  }

  listar(pagiana = 0) {
    this.filtro.pagina = pagiana;

    // Se selecionado um campeonato, filtrar a lista de etapas do campeonato.
    if (this.selectedCampeonatoId) {
      
      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('campeonatoFilter.id', this.selectedCampeonatoId)

      this.etapasService.pesquisar({...this.filtro})
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
    event.newData.campeonato = this.selectedCampeonatoId;

    // Converter a data para o formato yyyy-MM-dd antes de salvar
    const dataEtapaFormatada = this.formatarData(event.newData.dataEtapa);
    console.log('Data ', dataEtapaFormatada, ' Tela ', event.newData.dataEtapa)
    event.newData.dataEtapa = dataEtapaFormatada;

    // Converter a data para o formato yyyy-MM-dd antes de salvar
    const dataInscriFormatada = this.formatarData(event.newData.dataInscricao);
    event.newData.dataEtapa = dataInscriFormatada;

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

  formatarData(data: string): string {
    // Converter a data de string para Date
    const dataObj = new Date(data);
  
    // Formatar a data para yyyy-MM-dd (verifique se é esse o formato esperado pelo banco)
    const ano = dataObj.getFullYear();
    const mes = dataObj.getMonth() + 1; // Mês começa do 0
    const dia = dataObj.getDate();
  
    // Formatar o mês e dia com zeros à esquerda (opcional)
    const mesStr = mes.toString().padStart(2, '0');
    const diaStr = dia.toString().padStart(2, '0');
  
    return `${ano}-${mesStr}-${diaStr}`;
  }

}

