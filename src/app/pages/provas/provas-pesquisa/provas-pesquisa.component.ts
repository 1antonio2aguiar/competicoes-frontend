import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';

import { ProvasService } from '../provas.service';
import { Prova } from '../../../shared/models/prova';
import { ProvasIudComponent } from '../provas-iud/provas-iud.component';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete-modal.component';
import { Campeonato } from '../../../shared/models/campeonato';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { Etapa } from '../../../shared/models/etapa';
import { EtapasService } from '../../etapas/etapas.service';

@Component({
  selector: 'ngx-provas-pesquisa',
  templateUrl: './provas-pesquisa.component.html',
  styleUrls: ['./provas-pesquisa.component.scss']
}) 

export class ProvasPesquisaComponent implements OnInit{
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  provas: any[] = [];

  campeonatos: Campeonato[] = [];
  etapas: Etapa[] = [];

  selectedCampeonatoId: number;
  selectedEtapaId: number;

  settings = {
    mode: 'external',

    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      //width: '40px',
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

      campeonatoNome: {
        title: 'Campeonato',
        type: 'object',
      },

      etapaNome: {
        title: 'Etapa',
        type: 'object',
      },

      /*distancia: {
        title: 'Distancia',
        type: 'string',
        width: '50px',
      },*/

      tipoNadoDescricao: {
        title: 'Nado',
        type: 'string',
        width: '100px',
      },

      categoriaDescricao: {
        title: 'Categoria',
        type: 'string',
        width: '100px',
      },

      /*genero: {
        title: 'Genero',
        type: 'string', // Mudamos o tipo para 'html'
        width: '100px',
        valuePrepareFunction: (genero) => {
          if (genero === 'M') {
            return 'MASCULINO';
          } else if (genero === 'F') {
            return 'FEMININO';
          } else {
            return genero; // Retorna o valor original se não for M nem F
          }
        },
      },*/

      revezamento: {
        title: 'Revezamento',
        type: 'string',
        width: '20px',
        valuePrepareFunction: (revezamento) => {
          if (revezamento === 'S') {
            return 'SIM';
          } else if (revezamento === 'N') {
            return 'NÃO';
          } else {
            return revezamento; // Retorna o valor original se não for M nem F
          }
        },
      },
    }
  }
  
  constructor(private provaService: ProvasService, 
    private campeonatoService: CampeonatosService, 
    private etapaService: EtapasService,
    private windowService: NbWindowService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
    ) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }
  
  ngOnInit(): void {
    this.filtrarPorCampeonato(0)

    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  listar() {
    this.filtro.pagina = 0;
    this.filtro.params = new HttpParams();

    this.provaService.pesquisar(this.filtro)

      .then(response => {
        const provas = response.provas;
        this.source.load(provas);
    });
  }

  onAdd() {
    this.abrirModalAddProva();
  }

  async abrirModalAddProva() {
      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };
  
      this.windowService.open(ProvasIudComponent, {
        title: `Cadastrar Prova`,
        buttons: buttonsConfig,
        context: { mode: 'add' }
      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado' || reason === 'save') {
          this.listar();
          this.showToast('Atleta cadastrado com sucesso!', 'success');
      }
    });
  }

  onEdit(event) {
    this.abrirModalEditarProva(event.data.id); 
  }

  async abrirModalEditarProva(id: number) {
      try {
        const provaCompleta: Prova = await this.provaService.getProvaById(id);

        console.log('prova completa ', provaCompleta)

        const buttonsConfig: NbWindowControlButtonsConfig = {
          minimize: false,
          maximize: false,
          fullScreen: true,
          close: true
        };
  
        this.windowService.open(ProvasIudComponent, {
          title: `Editar Prova`,
          buttons: buttonsConfig,
          context: { prova: provaCompleta, mode: 'edit' }
        }).onClose.subscribe((reason: string | undefined) => {
          if (reason === 'atualizado' || reason === 'save') {
            this.listar();
            this.showToast('Prova alterada com sucesso!', 'success');
          }
        });
      } catch (error) {
        this.showToast('ERRO ao tentar alterar prova!', 'danger');
        console.error("Erro ao buscar prova por ID:", error);
        // Trate o erro adequadamente
    }
  }

  onDelete(event): void {
    console.log('ja vai');
      this.dialogService.open(ConfirmDeleteComponent, {
        context: {
          title: 'Excluir Prova',
          message: `Tem certeza que deseja excluir a prova  ${event.data.id}?`,
          data: event.data
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.provaService.delete(event.data.id).subscribe(() => {
            this.listar();
            this.showToast('Prova excluída com sucesso!', 'success');
          },
            (error) => {
              this.showToast('Erro ao excluir prova!', 'danger');  // Adicionado o toast de erro
              console.error("Erro ao excluir prova:", error);
            });
      }
    });
  }

  showToast(message: string, status: string) {
    const config: Partial<NbToastrConfig> = {
      status: status,
      duration: 3000,
      preventDuplicates: true,
    };
    this.toastrService.show(message, '', config);
  }

  onCampeonatoChange(campeonatoId: number) {
    this.selectedCampeonatoId = campeonatoId;
    //console.log('no on change ' , this.selectedCampeonatoId )
    this.filtrarPorCampeonato(); // Chama a função para atualizar a tabela após a seleção
  }

  filtrarPorCampeonato(pagiana = 0) {
    if(this.selectedCampeonatoId > 0){

      this.filtro.pagina = pagiana;
  
      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('campeonatoFilter.id', this.selectedCampeonatoId)
      
      // Aqui busca etapas por campeonato (popular o select de pesquisa por etapa)
      this.etapaService.pesquisar({...this.filtro})
          .then(response => {
            this.etapas = response.etapas;
      });

      // Aqui busca a lista de provas por campeonatoId
      let paramsProvas = new HttpParams();
      paramsProvas = paramsProvas.append('etapaFilter.campeonatoFilter.id', this.selectedCampeonatoId);
      

      this.provaService.pesquisar({...this.filtro, params: paramsProvas})
        .then(response => {
          const provas = response.provas;
          this.source.load(provas);
        });

    } else {

        // Aqui popular os select de campeonatos e etapas, ainda não esta filtrando por nada

        // Campeonatos
        this.campeonatoService.listAllList()
          .then(campeonato => {
            this.campeonatos = campeonato;
          })
          .catch(error => {
            console.error("Erro ao carregar categorias:", error);
        });

        // Provas
        this.etapaService.listAll()
          .then(etapa => {
            this.etapas = etapa;
            //console.log('Resultado ', etapa)
          })
          .catch(error => {
            console.error("Erro ao carregar categorias:", error);
        });
    }

  }

  onEtapaChange(etapaId: number) {
    this.selectedEtapaId = etapaId;
    console.log
    this.filtrarPorEtapa(); // Chama a função para atualizar a tabela após a seleção
  }

  filtrarPorEtapa(pagiana = 0) {
    if(this.selectedEtapaId > 0){

      this.filtro.pagina = pagiana;
  
//      this.filtro.params = new HttpParams();
  //    this.filtro.params = this.filtro.params.append('etapaFilter.id', this.selectedEtapaId)
      
      // Aqui busca a lista de provas por etapaId
      let paramsProvas = new HttpParams();
      paramsProvas = paramsProvas.append('etapaFilter.id', this.selectedEtapaId);

      this.provaService.pesquisar({...this.filtro, params: paramsProvas})
        .then(response => {
          const provas = response.provas;
          this.source.load(provas);
      });
    }
  }

  // Aqui filtra pelo campo de busca do ng2 smart teble
  // Nova função para lidar com os filtros da tabela
  onTableFilter(filters: any) {
    let params = new HttpParams();
    
    // Garante que filters seja um array
    let filtersArray = (filters && filters.filters && Array.isArray(filters.filters)) ? filters.filters : [];

    let idFilter = filtersArray.find(f => f.field === 'id');
    let tipoNadoFilter = filtersArray.find(f => f.field === 'tipoNadoDescricao');
    //let equipeFilter = filtersArray.find(f => f.field === 'equipe');
    //let categoriaFilter = filtersArray.find(f => f.field === 'categoriaDescricao');
    
    if (idFilter && idFilter.search) {
      params = params.set('id', idFilter.search);
    }
    if (tipoNadoFilter && tipoNadoFilter.search) {
      params = params.set('pessoaNome',tipoNadoFilter.search);
    }
    /*if (equipeFilter && equipeFilter.search) {
      params = params.set('equipeFilter.nome',equipeFilter.search);
    }
    if (categoriaFilter && categoriaFilter.search) {
      params = params.set('categoria',categoriaFilter.search);
    }*/
    this.filtro.params = params;
    
    this.provaService.pesquisar({...this.filtro, params: params})
    .then(response => {
      const provas = response.provas;
      this.source.load(provas);
    });
  }
}

