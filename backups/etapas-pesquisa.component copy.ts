
import { Component, OnInit } from '@angular/core';
import { Cell, LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { EtapasService } from '../etapas.service';
import { HttpParams } from '@angular/common/http';
import { LocalCompeticaoSelectComponent } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.component';
import { CampeonatoSelectComponent } from '../../campeonatos/campeonatos-select/campeonatosSelectComponent';
import { LocaisCompeticoesSelectModule } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.module';

import { LocaisCompeticoesSelectService } from '../../locais-competicoes-bkp/locais-compticoes-select/locais-competicoes-select.service';
import { CampeonatosSelectService } from '../../campeonatos/campeonatos-select/campeonatos-select.service';
import * as internal from 'stream';
import { CellComponent } from 'ng2-smart-table/lib/components/cell/cell.component';

@Component({
  selector: 'ngx-etapas-pesquisa',
  templateUrl: './etapas-pesquisa.component.html',
  styleUrls: ['./etapas-pesquisa.component.scss']
})

/*@Component({
  selector: 'basic-example-source',
  styles: [],
  template: `
    <input #search class="search" type="text" placeholder="Search..." (keydown.enter)="onSearch(search.value)">
    <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
  `
})*/

export class EtapasIudComponent implements OnInit {
  locaisCompeticoes: any[] = [];
  campeonatos: any[] = [];

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
        title: 'Campeonato',
        type: 'number',
        editor: {
          type: 'custom',
          component: CampeonatoSelectComponent,
        },
        valuePrepareFunction: (value) => {
          return value.nome ? value.nome : 'Erro';
        },

        filter: {
          type: 'list',
          config: {
            selectText: 'Filtrar...',
            //list:  [ this.campeonatos ],
            list: [ CampeonatoSelectComponent ]
          },
        },
        
        
        //filterFunction: this.onFilterChange.bind('')
        //filterFunction: this.filterFunction.bind(this) // Vincula 'this' isso pode dar algum resultado.

        filterFunction: (cell?: any, searchTerm?: string) => {
          // Dentro da função de seta, 'this' se refere ao seu componente

          let newSettings = this.settings.columns.campeonato

          console.log('selectedValue.value ', newSettings)

          this.onCampeonatoChange(searchTerm,cell.id); // Ou use cell
          return false; // Ou retorne a lógica de filtragem
        }

          //filterFunction: this.filterCountFunction,

          /*filterFunction(cell: any, search?: string): boolean {
            console.log('cell ',cell);
            console.dir('search ',search);
            return false;
          }*/

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
        },
        filter: {
          type: 'list',
          //onClick: this.OnClickFiltro(),
          config: {
            selectText: 'Filtrar...',
            list: [ this.locaisCompeticoes ]
          },
        },
        filterFunction(cell?: any, search?: string): boolean {
          if (`${cell.fName} ${cell.lName}` == search) {
            return true;
          } else {
            return false;
          }
        }
      },
    }
  }

  source: LocalDataSource = new LocalDataSource();
  filtro = new Filters();
  dateService: any;
  selectedCampeonatoId: number;

  constructor(private etapasService: EtapasService, 
      private campeonatosSelectService: CampeonatosSelectService,    
      private locaisCompeticoesSelectService: LocaisCompeticoesSelectService,
      
      private router: Router,
      private routeActive: ActivatedRoute) {
        // Inicializar o filtro com valores padrões
        this.filtro.pagina = 1;
        this.filtro.itensPorPagina = 10;
  }

  onSearch(query: string = ''){
    console.log('search 1 ' , this.source.setFilter)
    this.source.setFilter([
      // {
      //   field: 'campeonato',
      //   search: query,
      // },
      // {
      //   field: 'nome',
      //   search: query
      // },
      console.log('seaech ' , query)
    ], false)
  }
      
  ngOnInit(): void {
    this.listar();

    this.getLocaisCompeticao();
    this.getCampeonatos();

  }

  


  onFilterChange(event: any) {
    
     const selectedCampeonato = this.settings
     //(
    //   campeonato => campeonato.id === event.selected
    // );
    console.log('onFilterChange', ); // Verifique o objeto event


    //const selectedCampeonato = event.filter.config.list.find(campeonato => campeonato.id === event.filter.config.select);
    // console.log('onFilterChange', selectedCampeonato); // Verifique o objeto event
    /*if (selectedCampeonato) {
      this.selectedCampeonatoId = selectedCampeonato.id;
      this.listar(); // Atualiza a tabela com a filtragem
    } else {
      // Limpar a filtragem caso o filtro seja removido
      this.selectedCampeonatoId = null;
      }*/
   //this.listar();
  }

    filterCountFunction(value?: any, search?: string): boolean {
      console.log('clicou1 ')
      //value.name.includes(search)
      if (Object.keys(value).length === JSON.parse(search)) return true;
      return false;
    }

  onCampeonatoChange(searchTerm, id: any) {
    //console.log('clicou2 ', searchTerm, ' ', this.settings.columns.localCompeticao.filter.config.list)

    //this.selectedCampeonatoId = campeonatoId; 
    //this.listar(); // Chama a função para atualizar a tabela após a seleção
    //this.listar();
  }

  listar(pagiana = 0) {
    this.filtro.pagina = pagiana;

    console.log('veio ', this.selectedCampeonatoId)

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

  getLocaisCompeticao(){
    this.locaisCompeticoesSelectService.listAll().subscribe(data=>{
        data.forEach(obj => { this.locaisCompeticoes.push({id: obj.id, title:obj.nome})
      });

      let newSettings = this.settings;
      newSettings.columns.localCompeticao.filter.config.list = this.locaisCompeticoes;
      this.settings = Object.assign({}, newSettings);
    });
  }

  getCampeonatos(){
    this.campeonatosSelectService.listAll().subscribe(data=>{
        data.forEach(obj => { this.campeonatos.push({id: obj.id, title:obj.nome, selected: false})
      });

      let newSettings = this.settings;
      newSettings.columns.campeonato.filter.config.list = this.campeonatos;
      this.settings = Object.assign({}, newSettings);
    });
  }

    
}
