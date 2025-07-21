import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpParams } from '@angular/common/http';

import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';

import { Filters } from '../../../shared/filters/filters';
import { Campeonato } from '../../../shared/models/campeonato';
import { Etapa } from '../../../shared/models/etapa';
import { InscricoesService } from '../inscricoes.service';
import { ProvasService } from '../../provas/provas.service';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { EtapasService } from '../../etapas/etapas.service';
import { Prova } from '../../../shared/models/prova';
import { InscricoesIudComponent } from '../inscricoes-iud/inscricoes-iud.component';
import { Inscricao } from '../../../shared/models/inscricao';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete-modal.component';
import { ParametrosService } from '../../parametros/parametros.service';
import { Parametro } from '../../../shared/models/parametro';
import { filter } from 'rxjs-compat/operator/filter';

@Component({
  selector: 'ngx-inscricoes-pesquisa',
  templateUrl: './inscricoes-pesquisa.component.html',
  styleUrls: ['./inscricoes-pesquisa.component.scss']
})

export class InscricoesPesquisaComponent implements OnInit{
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  inscricoes: any[] = [];

  // arrays que compoem os selects da tela aqui sempre traz uma lista
  campeonatos: Campeonato[] = [];
  etapas: Etapa[] = [];
  provas: Prova[] = [];
  parametros: Parametro[] = [];

  // Este obj é para passar para o modal add/edit
  dadosProva: Prova | null = null;

  selectedCampeonatoId: number;
  selectedCampeonatoNome: string;
  selectedEtapaId: number;
  selectedEtapaNome: string;
  selectedProvaId: number;

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
        hide: true,
      },

      empresa: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (empresa) => {
          return empresa.value = 1;
        },
      },

      /*campeonatoNome: {
        title: 'Campeonato',
        type: 'object',
      },*/

      /*etapaNome: {
        title: 'Etapa',
        type: 'string',
      },*/

      /*provaId: {
        title: 'Prova',
        type: 'number',
        width: '20px',
      },*/

      statusDescricao: {
        title: 'Status',
        type: 'string',
        width: '100px',
        //filter: false
      },

      equipeNome: {
        title: 'Equipe',
        type: 'string',
        //filter: false
      },

      statusTipoInscricao: {
        width: '147px',
        title: 'Fase',
         valuePrepareFunction: (cell, row) => row.statusTipoInscricaoDescricao|| '',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [
              { value: '0', title: 'Classificatória' }, // Use string '0' se o backend espera número
              { value: '1', title: 'Semifinal' },
              { value: '2', title: 'Final' }
            ]
          }
        }
      },
      
      atletaNome: {
        title: 'Atleta',
        type: 'string',
      },


      serie: {
        title: 'Série',
        type: 'number',
        width: '40px',
      },

      baliza: {
        title: 'Raia',
        type: 'number',
        width: '40px',
        //filter: false
      },

      
    }
  }

  constructor(private inscricaoService: InscricoesService,
      private provaService: ProvasService, 
      private campeonatoService: CampeonatosService, 
      private etapaService: EtapasService,
      private parametroService: ParametrosService,
      private windowService: NbWindowService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService,

      private renderer: Renderer2,
      private el: ElementRef
    ) {
      // Inicializar o filtro com valores padrões
      this.filtro.pagina = 1;
      this.filtro.itensPorPagina = 10;
  }


  ngOnInit(): void {
    //this.listar();
    
    this.filtrarPorCampeonato(0);
    
    this.source.onChanged().subscribe((change) => {
      const qtdLinhas = change.filter.filters.length
      const searchValue = change?.filter?.filters?.[qtdLinhas - 1]?.search ;
      //console.log('CHANGE ', searchValue)
      
      if (change.filter.filters.length === 0 || searchValue === "") {
        return; 
      }
      
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  onAdd() {
    //console.log('Add')
    this.abrirModalAddIncricao();
  }

  async abrirModalAddIncricao() {
      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      this.windowService.open(InscricoesIudComponent, {
        title: `Cadastrar Inscrição`,
        buttons: buttonsConfig,
        context: { mode: 'add',
          telaOrigem: 'Inscricao',
          prova: this.selectedProvaId,
          dadosProva: this.dadosProva,
          parametro: this.parametros 
        }
      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado' || reason === 'save') {
          this.listar();
          this.showToast('Inscrição cadastrada com sucesso!', 'success');
      }
    });
  }

  onEdit(event) {
    console.log('Edit')
    this.abrirModalEditarIncricao(event.data.id); 
  }

  async abrirModalEditarIncricao(id: number) {
  
    try {
      const inscricaoCompleta: Inscricao = await this.inscricaoService.getInscricaoById(id);

      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      this.windowService.open(InscricoesIudComponent, {
        title: `Editar Inscrição`,
        buttons: buttonsConfig,
        context: { inscricao: inscricaoCompleta, 
          mode: 'edit' ,
          telaOrigem: 'Inscricao',
          prova: this.selectedProvaId,
          dadosProva: this.dadosProva,
          parametro: this.parametros
        }
      }).onClose.subscribe((reason: string | undefined) => {
        if (reason === 'atualizado' || reason === 'save') {
          this.listar();
          this.showToast('Inscrição alterada com sucesso!', 'success');
        }
      });
    } catch (error) {
      this.showToast('ERRO ao tentar alterar inscrição!', 'danger');
      console.error("Erro ao buscar inscricao por ID:", error);
      // Trate o erro adequadamente
    }
  }

  onDelete(event): void {
    this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Excluir Inscrição',
        message: `Tem certeza que deseja excluir a inscrição  ${event.data.id}?`,
        data: event.data
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.inscricaoService.delete(event.data.id).subscribe(() => {
          this.listar();
          this.showToast('Inscrição excluída com sucesso!', 'success');
        },
          (error) => {
            this.showToast('Erro ao excluir Inscrição!', 'danger');  // Adicionado o toast de erro
            console.error("Erro ao excluir Inscrição:", error);
          });
      }
    });
  }

  onCampeonatoChange(campeonato: string) {
    const parts = campeonato.split('|');
    this.selectedCampeonatoId = parseInt(parts[0], 10); // Converte o ID para número
    this.selectedCampeonatoNome = parts[1];

    this.filtrarPorCampeonato(); 
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

    } else {

      // Aqui popular os select de campeonatos e etapas, ainda não esta filtrando por nada

      // Campeonatos
      this.campeonatoService.listAllList()
        .then(campeonato => {
          this.campeonatos = campeonato;
        })
        .catch(error => {
          console.error("Erro ao carregar campeonatos:", error);
      });

      // Etapas
      this.etapaService.listAll()
        .then(etapa => {
          this.etapas = etapa;
          //console.log('Resultado ', etapa)
        })
        .catch(error => {
          console.error("Erro ao carregar etapas:", error);
      });
    }
  }

  onEtapaChange(etapa: string) {
    const parts = etapa.split('|');
    this.selectedEtapaId = parseInt(parts[0], 10); // Converte o ID para número
    this.selectedEtapaNome = parts[1];

    this.filtrarPorEtapa(); // Chama a função para atualizar a tabela após a seleção
  }

  filtrarPorEtapa(pagiana = 0) {
    if(this.selectedEtapaId > 0){

      this.filtro.pagina = pagiana;
  
      // Aqui busca a lista de provas por etapaId
      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('etapaFilter.id', this.selectedEtapaId)

      // Aqui busca provas por etapa (popular o select de pesquisa por prova)
      this.provaService.pesquisar({...this.filtro})
          .then(response => {
            this.provas = response.provas;
      });

      // Aqui busca o parametro da quantidade de balizas/raias etapaId
      this.parametroService.pesquisar({...this.filtro})
          .then(response => {
            this.parametros = response.parametros;
      });
    }
  }

  onProvaChange(provaId: number) {
    this.selectedProvaId = provaId;
    this.filtrarPorProva(); // Chama a função para atualizar a tabela após a seleção
  }

  async filtrarPorProva(pagiana = 0) {
    if(this.selectedProvaId > 0){
      // Busca prova aqui para mostrar no modal de add/edit.
      try{
        this.dadosProva = await this.provaService.getProvaById(this.selectedProvaId);
        // Aqui busca todas as inscricoes por prova 
        this.listar()
        
      } catch (error) {
        this.dadosProva = null; // Limpa os dados em caso de erro
        this.showToast('Erro ao carregar dados da prova.', 'danger');
        // Você pode querer limpar a lista de inscrições também aqui
      }
    }  
  }

  listar() {
    this.filtro.pagina = 0;
      
    this.filtro.params = new HttpParams();
    this.filtro.params = this.filtro.params.append('provaId', this.selectedProvaId)

    this.filtro.params = this.filtro.params.append('sort', 'tipoInscricao,asc');
    this.filtro.params = this.filtro.params.append('sort', 'serie,asc');
    this.filtro.params = this.filtro.params.append('sort', 'baliza,asc');

    this.inscricaoService.pesquisar({...this.filtro})
    .then(response => {
      const inscricoes = response.inscricoes;
      this.source.load(inscricoes);

    })
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
  onTableFilter(filterEvent: any) {
    //let params = new HttpParams();
    this.filtro.params = new HttpParams();
    this.filtro.params = this.filtro.params.append('provaId', this.selectedProvaId)

    
    // Garante que filters seja um array
    let activeFiltersArray = (filterEvent && filterEvent.filters && Array.isArray(filterEvent.filters)) ? filterEvent.filters : [];

    let triggeringField: string | null = null;
    let triggeringSearchValue: string | null = null;

    // Verifica se há apenas um filtro ativo com valor de busca
    const filtersWithSearch = activeFiltersArray.filter(f => f.search && f.search.trim() !== '');

    if (filtersWithSearch.length === 1) {
      triggeringField = filtersWithSearch[0].field;
      triggeringSearchValue = filtersWithSearch[0].search;

    } else if (filtersWithSearch.length > 1) {
      // Cenário mais complexo: múltiplos filtros aplicados de uma vez (improvável pela UI padrão)
      // Poderia pegar o último, ou o primeiro. Para simplificar, vamos assumir que a UI
      // dispara o evento com base no último campo modificado.
      // Se `filterEvent.field` existir, ele é mais confiável:
      if (filterEvent.field && filterEvent.field.key) {
           triggeringField = filterEvent.field.key; // 'key' é geralmente o nome do campo da coluna
           const foundFilter = activeFiltersArray.find(f => f.field === triggeringField);
           if (foundFilter) {
               triggeringSearchValue = foundFilter.search;
           }
      } else {
          // Fallback se filterEvent.field não estiver disponível: pegar o último com valor.
          // Isso é um palpite e pode não ser 100% preciso em todos os casos.
          const lastActiveFilter = filtersWithSearch[filtersWithSearch.length - 1];
          if (lastActiveFilter) {
              triggeringField = lastActiveFilter.field;
              triggeringSearchValue = lastActiveFilter.search;
          }
      }
    }

    if (triggeringField && triggeringSearchValue && triggeringSearchValue.trim() !== '') {
      switch (triggeringField) {
        case 'atletaNome':
          this.filtro.params = this.filtro.params.set('atletaFilter.pessoaNome', triggeringSearchValue);
          break;
        case 'serie':
          this.filtro.params = this.filtro.params.set('serie', triggeringSearchValue);
          break;
        case 'statusTipoInscricao': // Nome da coluna no 'settings'
          this.filtro.params = this.filtro.params.set('tipoInscricao', triggeringSearchValue); 
          break;
        case 'id': // Se você tiver um filtro de ID na tabela
          this.filtro.params = this.filtro.params.set('id', triggeringSearchValue);
          break;
        default:
          this.listar();
          break;
      }
    }

    this.filtro.params = this.filtro.params.append('sort', 'tipoInscricao,asc');
    this.filtro.params = this.filtro.params.append('sort', 'serie,asc');
    this.filtro.params = this.filtro.params.append('sort', 'baliza,asc');

    this.inscricaoService.pesquisar({...this.filtro})
    .then(response => {
      const inscricoes = response.inscricoes;
      //console.log('inscricoes ', inscricoes)
      this.source.load(inscricoes);
    });
  }

  onFilterFocus(event: FocusEvent): void {
    // O target é o elemento que REALMENTE recebeu o foco (o <input> ou <select>)
    const targetElement = event.target as HTMLElement;

    // Verifica se o elemento focado é um INPUT ou SELECT (tipos comuns de filtro)
    if (targetElement && (targetElement.tagName === 'INPUT' || targetElement.tagName === 'SELECT')) {

      // Tenta encontrar a célula do cabeçalho (<th>) pai mais próxima
      const headerCell = targetElement.closest('th');

      if (headerCell) {
        // Verifica as classes da célula do cabeçalho. ng2-smart-table
        // frequentemente adiciona classes baseadas no ID/field da coluna.
        const headerClasses = headerCell.classList;

        // Define os campos de filtro que você quer monitorar
        const monitoredFilterFields = ['atletaNome', 'serie', 'statusTipoInscricao'];

        // Procura por uma classe que corresponda a um dos campos monitorados
        let fieldName: string | null = null;
        for (const field of monitoredFilterFields) {
          if (Array.from(headerClasses).some(cls => cls.toLowerCase().includes(field.toLowerCase()))) {
             fieldName = field;
             break; // Encontrou o campo correspondente
          }
        }

        // Se encontrou um nome de campo correspondente, dispara sua lógica
        if (fieldName) {
          this.source.setFilter([], true);
        }
        // Se não for um dos campos monitorados, não faz nada.
      }
    }
  }
  
  isLoadingRelatorio = false; // Flag para o botão de relatório

  async gerarRelatorioInscricoes() {
    if (!this.selectedProvaId) {
      this.showToast('Selecione uma prova para gerar o relatório.', 'warning');
      return;
    }

    this.isLoadingRelatorio = true;
    this.showToast('Gerando relatório...', 'info'); // Toast mais longo

    try {
      // --- Buscar TODOS os dados para o relatório (sem paginação) ---
      // Crie um HttpParams específico para buscar todos os dados
      // O backend precisa suportar um 'size' muito grande ou ausência de 'page'/'size' para retornar tudo
      // ATENÇÃO: Buscar muitos dados de uma vez pode ser lento e consumir memória.
      // Considere se um limite razoável (ex: 500-1000 registros) é aceitável ou se o backend
      // deveria ter um endpoint específico para relatórios.

      let paramsRelatorio = new HttpParams()
        .set('provaId', this.selectedProvaId.toString())
        // Adicionar os parâmetros de ordenação que você quer no relatório
        .append('sort', 'tipoInscricao,asc')
        .append('sort', 'serie,asc')
        .append('sort', 'baliza,asc');
      // Para buscar "todos", envie um 'size' grande ou use um endpoint que não pagine
      // paramsRelatorio = paramsRelatorio.set('size', '10000'); // Exemplo de size grande

      // Crie um objeto Filters para passar ao serviço
      const filtroRelatorio: Filters = {
        pagina: 0, // Não relevante se buscar todos
        itensPorPagina: 30, // Tamanho grande
        totalRegistros: 0,
        nome: '', // Adicione outros filtros se o relatório deve ser filtrado
        params: paramsRelatorio
      };

      const response = await this.inscricaoService.pesquisar(filtroRelatorio);
      const todasInscricoes: Inscricao[] = response.inscricoes; // Assumindo que seu serviço retorna a lista completa aqui

      if (!todasInscricoes || todasInscricoes.length === 0) {
        this.showToast('Nenhuma inscrição encontrada para o relatório.', 'info');
        this.isLoadingRelatorio = false;
        return;
      }

      // --- Montar o HTML do Relatório ---
      let htmlRelatorio = `
        <html>
        <head>
          <title>Relatório de Inscrições - Prova: ${this.dadosProva?.etapa || this.selectedProvaId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header-relatorio { text-align: center; margin-bottom: 20px; }
            .header-relatorio h1 { margin: 0; }
            @media print {
              body { margin: 0.5cm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-relatorio">
            <h1>Relatório de Inscrições</h1>
            <p> 
            ${this.dadosProva?.etapa || '' +  this.selectedCampeonatoNome}
            ${this.dadosProva?.etapa || 'Etapa ' +  this.selectedEtapaNome}
            ${this.dadosProva?.etapa || ' Prova ' + this.selectedProvaId}</p>
            <p>Gerado em: ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Equipe</th>
                <th>Série</th>
                <th>Baliza</th>
                <th>Fase</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      todasInscricoes.forEach(insc => {
        console.log('relatorio de inscrições ', insc)
        htmlRelatorio += `
              <tr>
                <td>${insc.atletaNome|| ''}</td>
                <td>${insc.equipeNome|| ''}</td>
                <td>${insc.serie || ''}</td>
                <td>${insc.baliza || ''}</td>
                <td>${insc.statusTipoInscricaoDescricao || ''}</td>
                <td>${insc.statusDescricao || ''}</td>
              </tr>
        `;
      });

      htmlRelatorio += `
            </tbody>
          </table>
          <button class="no-print" onclick="window.print()">Imprimir Relatório</button>
        </body>
        </html>
      `;

      // --- Abrir HTML em Nova Janela ---
      const reportWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      if (reportWindow) {
        reportWindow.document.open();
        reportWindow.document.write(htmlRelatorio);
        reportWindow.document.close(); // Essencial para finalizar o carregamento
        // reportWindow.focus(); // Opcional
        // reportWindow.print(); // Opcional: chamar impressão automaticamente
      } else {
        this.showToast('Não foi possível abrir a janela do relatório. Verifique bloqueadores de pop-up.', 'warning');
      }

    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      this.showToast('Erro ao gerar relatório.', 'danger');
    } finally {
      this.isLoadingRelatorio = false;
    }
  }


}

