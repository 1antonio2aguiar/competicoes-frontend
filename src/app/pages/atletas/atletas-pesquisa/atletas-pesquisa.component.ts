import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';
import { AtletasService } from '../atletas.service';
import { Atleta } from '../../../shared/models/atleta';
import { AtletasIudComponent } from '../atletas-iud/atletas-iud.component';
import { ConfirmDeleteComponent } from '../../equipes/confirm-delete/confirm-delete-modal.component';

@Component({
  selector: 'ngx-atletas-pesquisa',
  templateUrl: './atletas-pesquisa.component.html',
  styleUrls: ['./atletas-pesquisa.component.scss']
})

export class AtletasPesquisaComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  atletas: any[] = [];

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

      pessoaNome: {
        title: 'Nome',
        type: 'string',
        /*valuePrepareFunction: (pessoa) => {
          return pessoa ? pessoa.nome : ''; // Retorna pessoa.nome ou uma string vazia se tecnico for null ou undefined
        },*/
      },

      equipeNome: {
        title: 'Equipe',
        type: 'string', 
        /*valuePrepareFunction: (equipe) => {
          return equipe ? equipe.nome : ''; // Retorna equipe.nome ou uma string vazia se agremiacao for null ou undefined
        },*/
      },

      categoriaDescricao: {
        title: 'Categoria',
        type: 'string',
        width: '150px',
      },
      
    }
  }

  constructor(private atletaService: AtletasService, 
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
    ) {

  }

  ngOnInit(): void {

    this.listar();

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  listar() {
    this.atletaService.pesquisar(this.filtro)
      .then(response => {
        const atletas = response.atletas;
        this.source.load(atletas);
    });
  }

  onAdd() {
    this.abrirModalAddAtleta();
  }

  async abrirModalAddAtleta() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: true,
      close: true
    };

    this.windowService.open(AtletasIudComponent, {
      title: `Cadastrar Atleta`,
      buttons: buttonsConfig,
      context: { mode: 'add',
        telaOrigem: 'Atleta'
      }
    }).onClose.subscribe((reason: string | undefined) => {
      if (reason === 'atualizado' || reason === 'save') {
        this.listar();
        this.showToast('Atleta cadastrado com sucesso!', 'success');
      }
    });
  }

  onEdit(event) {
    this.abrirModalEditarAtleta(event.data.id); 
  }

  async abrirModalEditarAtleta(id: number) {

    try {
      const atletaCompleta: Atleta = await this.atletaService.getAtletaById(id);

      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      this.windowService.open(AtletasIudComponent, {
        title: `Editar Atleta`,
        buttons: buttonsConfig,
        context: { atleta: atletaCompleta, mode: 'edit' }
      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado' || reason === 'save') {
          this.listar();
          this.showToast('Atleta alterado com sucesso!', 'success');
        }
      });
    } catch (error) {
      this.showToast('ERRO ao tentar alterar atleta!', 'danger');
      console.error("Erro ao buscar atleta por ID:", error);
      // Trate o erro adequadamente
    }
  }

  onDelete(event): void {
    //console.log('EVENT ', event.data)
    this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Excluir Atleta',
        message: `Tem certeza que deseja excluir o atleta  ${event.data.pessoa.nome}?`,
        data: event.data
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.atletaService.delete(event.data.id).subscribe(() => {
          this.listar();
          this.showToast('Atleta excluído com sucesso!', 'success');
        },
          (error) => {
            this.showToast('Erro ao excluir Atleta!', 'danger');  // Adicionado o toast de erro
            console.error("Erro ao excluir Atleta:", error);
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

  // Aqui filtra pelo campo de busca do ng2 smart teble
  // Nova função para lidar com os filtros da tabela
  onTableFilter(filters: any) {
    let params = new HttpParams();
    
    // Garante que filters seja um array
    let filtersArray = (filters && filters.filters && Array.isArray(filters.filters)) ? filters.filters : [];

    let idFilter = filtersArray.find(f => f.field === 'id');
    let nomeFilter = filtersArray.find(f => f.field === 'pessoaNome');
    let equipeFilter = filtersArray.find(f => f.field === 'equipe');
    let categoriaFilter = filtersArray.find(f => f.field === 'categoriaDescricao');
    
    if (idFilter && idFilter.search) {
      params = params.set('id', idFilter.search);
    }
    if (nomeFilter && nomeFilter.search) {
      params = params.set('pessoaNome',nomeFilter.search);
    }
    if (equipeFilter && equipeFilter.search) {
      params = params.set('equipeFilter.nome',equipeFilter.search);
    }
    if (categoriaFilter && categoriaFilter.search) {
      params = params.set('categoria',categoriaFilter.search);
    }
    this.filtro.params = params;
    
    this.atletaService.pesquisar({...this.filtro, params: params})
    .then(response => {
      const atletas = response.atletas;
      //console.log('Atletas ', atletas)
      this.source.load(atletas);
    });
  }
}
