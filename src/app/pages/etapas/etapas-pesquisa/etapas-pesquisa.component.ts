
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { NbDialogService, NbWindowControlButtonsConfig, NbWindowService, NbToastrService } from '@nebular/theme';
//Nao apagar este
import { LocaisCompeticoesSelectModule } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.module';

import { EtapasService } from '../etapas.service';
import { LocalCompeticaoSelectComponent } from '../../locais-competicoes/locais-compticoes-select/locais-competicoes-select.component';
import { DatepickerComponent } from '../../forms/datepicker/datepicker.component';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { EstapasIudComponent } from '../estapas-iud/estapas-iud.component';
import { title } from 'process';
import { Etapa } from '../../../shared/models/etapa';
import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'ngx-etapas-pesquisa',
  templateUrl: './etapas-pesquisa.component.html',
  styleUrls: ['./etapas-pesquisa.component.scss']
})

export class EtapasPesquisaComponent implements OnInit {
  locaisCompeticoes: any[] = [];
  campeonatos: any[] = [];
  selectedCampeonatoId: number;
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  
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
      width: '40px',
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
      nome: {
        title: 'Nome',
        type: 'string',
        width: '200px',
      },

      localCompeticao: {
        title: 'Local Competição',
        type: 'number',
        /*width: '200px',*/
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
      }
    }
  }

  constructor(private etapasService: EtapasService, 
      private campeonatosService: CampeonatosService,   
      private windowService: NbWindowService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService
  ) {
  }
  
  ngOnInit(): void {
    
    this.campeonatosService.listAllList()
    .then(campeonatos => {
        // Se campeonatos for um array com um único elemento
        this.campeonatos = [...campeonatos];
    })
    .catch(error => console.error('Erro ao obter lista de campeonatos:', error));

    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  onAdd() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: true,
      close: true
    };
    
    const windowRef = this.windowService.open(EstapasIudComponent, {
      //context: { coachingDocument: 1 },
      context: { mode: 'add' },
      buttons: buttonsConfig,
      title: `Cadastra Etapas`,
      windowClass: "window-form-popup",
      closeOnBackdropClick: false,
      
    })
    .onClose.subscribe((reason: string | undefined) => {
      if (reason === 'criado' || reason === 'atualizado') {
        this.listar(); // Chama o método listar() aqui!

        this.toastrService.show(
          'A nova etapa foi cadastrada com sucesso!',
          'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
      }
    });
  }

  onDelete(event): void {
    const etapaParaExcluir = event.data;

    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Usando HTML para destacar o nome
        message: `Você tem certeza que deseja excluir a etapa <strong>"${etapaParaExcluir.nome}"</strong>?<br><br><span class="small text-muted">Esta ação não poderá ser desfeita.</span>`,
        confirmButtonText: 'Sim, Excluir',
        cancelButtonText: 'Cancelar',
        status: 'danger', // Cor do botão e do ícone
        icon: 'trash-2-outline' // Ícone mais específico para exclusão
      },
      closeOnBackdropClick: false
    }).onClose.subscribe(confirmado => {
      if (confirmado) {
        // Lógica de exclusão (exatamente como antes)
        this.etapasService.delete(etapaParaExcluir.id).subscribe({
          next: () => {
            this.listar();
            event.confirm.resolve();
            
            this.toastrService.show(
              `A etapa "${etapaParaExcluir.nome}" foi excluída com sucesso!`,
              'Exclusão Realizada',
              { status: 'success', icon: 'trash-2-outline' }
            );
          },
          error: (erro) => {
            console.error('Erro ao deletar etapa:', erro);
            event.confirm.reject();
            // Adicionar notificação de erro aqui
          }
        });
      } else {
        event.confirm.reject();
      }
    });
  }

  onEdit(event) {
    this.abrirModalEditarEtapa(event.data.id); 
  }

  async abrirModalEditarEtapa(id: number) {

    try {
      const etapaCompleta: Etapa = await this.etapasService.getEtapaById(id);

      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      this.windowService.open(EstapasIudComponent, {
        title: `Editar Etapa`,
        buttons: buttonsConfig,
        context: { etapa: etapaCompleta, mode: 'edit' }
      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado') {
          this.listar();

        // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
        this.toastrService.show(
          `A etapa "${etapaCompleta.nome}" foi atualizada com sucesso!`,
          'Atualização Realizada',
          { status: 'success', icon: 'edit-outline' }
          );
        }
      });
    } catch (error) {
      console.error("Erro ao buscar etapa por ID:", error);
      // Trate o erro adequadamente
    }
  }

  onCampeonatoChange(campeonatoId: number) {
    this.selectedCampeonatoId = campeonatoId;
    //console.log('no on change ' , this.selectedCampeonatoId )
    this.listar(); // Chama a função para atualizar a tabela após a seleção
  }

  listar(pagiana = 0) {
    this.filtro.pagina = pagiana;

    // Se selecionado um campeonato, filtrar a lista de etapas do campeonato.
    if (this.selectedCampeonatoId) {
      //console.log('Campeonato ', this.selectedCampeonatoId)

      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('campeonatoFilter.id', this.selectedCampeonatoId)

      //console.log('Parametro ', this.filtro.params)
      this.etapasService.pesquisar({...this.filtro})
        .then(response => {
          const etapas = response.etapas;
          this.source.load(etapas);
        });
    } else { // Caso contrário, listar todas as etapas
      //console.log('entrou no else ', this.selectedCampeonatoId)
      this.etapasService.pesquisar(this.filtro)
        .then(response => {
          const etapas = response.etapas;
          this.source.load(etapas);
        });
    }
  };

  // Aqui filtra pelo campo de busca do ng2 smart teble
  // Nova função para lidar com os filtros da tabela
  onTableFilter(filters: any) {
    let params = new HttpParams();
    
    // Garante que filters seja um array
    let filtersArray = (filters && filters.filters && Array.isArray(filters.filters)) ? filters.filters : [];
    
    let idFilter = filtersArray.find(f => f.field === 'id');
    let nomeFilter = filtersArray.find(f => f.field === 'nome');
    //let localCompeticaoFilter = filtersArray.find(f => f.field === 'localCompeticao');
    
    if (idFilter && idFilter.search) {
      params = params.set('id', idFilter.search);
    }
    if (nomeFilter && nomeFilter.search) {
      params = params.set('nome',nomeFilter.search);
    }
    /*if (localCompeticaoFilter && localCompeticaoFilter.search) {
      params = params.set('localCompeticao',localCompeticaoFilter.search);
    }*/
    this.filtro.params = params;

    this.etapasService.pesquisar({...this.filtro, params: params})
      .then(response => {
        const etapas = response.etapas;
      this.source.load(etapas);
    });
  }
}