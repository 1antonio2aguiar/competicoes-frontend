import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpParams } from '@angular/common/http';

import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';

import { Filters } from '../../../shared/filters/filters';

import { Campeonato } from '../../../shared/models/campeonato';
import { Etapa } from '../../../shared/models/etapa';
import { Prova } from '../../../shared/models/prova';

import { ProvasService } from '../../provas/provas.service';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { EtapasService } from '../../etapas/etapas.service';
import { ApuracoesService } from '../apuracoes.service';
import { InscricoesService } from '../../inscricoes/inscricoes.service';
import { ResultadoEditorComponent } from './components/resultado-editor.component';
import { Apuracao } from '../../../shared/models/apuracao';

@Component({
  selector: 'ngx-apuracoes-pesquisa',
  templateUrl: './apuracoes-pesquisa.component.html',
  styleUrls: ['./apuracoes-pesquisa.component.scss']
})

export class ApuracoesPesquisaComponent implements OnInit{
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  inscricoes: any[] = [];

  // arrays que compoem os selects da tela aqui sempre traz uma lista
  campeonatos: Campeonato[] = [];
  etapas: Etapa[] = [];
  provas: Prova[] = [];

  selectedCampeonatoId: number;
  selectedEtapaId: number;
  selectedProvaId: number;

  settings = {
    //mode: 'external',
    mode: 'inline', // Habilita a edição inline

    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    columns: {
      apuracaoId: {
        title: 'Apuração',
        type: 'number',
        editable: false,
        addable: false,
        width: '20px',
        hide: true,
      },

      inscricaoId: {
        title: 'Inscrição',
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

      equipeNome: {
        title: 'Equipe',
        type: 'string',
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
      },

      tipoInscricao: {
        title: 'Fase',
        type: 'number',
        width: '90px',
        valuePrepareFunction: (value: number | null | undefined) => {
          // 'value' aqui é o valor numérico (0, 1, 2) da célula
          switch (value) {
            case 0:
              return 'Classificação'; // Retorna a string para exibir
            case 1:
              return 'Semifinal';
            case 2:
              return 'Final';
            default:
              // O que fazer se o valor for diferente de 0, 1, 2 ou for null/undefined?
              return 'N/D'; // Ou retorne value?.toString() ?? '', ou apenas ''
          }
        },
      },

      resultado: {
        title: 'Resultado',
        type: 'custom',           // <<< MUITO IMPORTANTE: Usa custom
        width: '140px',           // <<< Aumente a largura para caber o input
        editable: false,          // Reflete que a edição padrão não é usada
        addable: false,
        renderComponent: ResultadoEditorComponent,
          editor: {
            type: 'custom',
            component: ResultadoEditorComponent,
        },
        onComponentInitFunction: (instance: ResultadoEditorComponent) => {
          // Verifica se a instância está disponível
          if (instance) {
            // Inscreve-se no evento 'valueCommit' que criamos
            instance.valueCommit.subscribe(commitEvent => {
              // Chama o método do componente pai para lidar com o valor finalizado
              this.handleResultCommit(commitEvent);
            });
            // Armazenar instância se ainda precisar para outros fins
            // if (instance.rowData && instance.rowData.id !== undefined) {
            //    this.editorInstances.set(instance.rowData.id, instance);
            // }
          } else {
            console.warn("Component instance not available for subscribing to valueCommit");
          }
        }
      },

    },

    actions: {
      add: false,
      edit: false, 
      delete: false
    },
    selectMode: 'single',
  }

  constructor(private apuracaoService: ApuracoesService,
    private inscricaoService: InscricoesService,
    private provaService: ProvasService,
    private campeonatoService: CampeonatosService,
    private etapaService: EtapasService,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {
    // Inicializar o filtro com valores padrões
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }

  ngOnInit(): void {
    this.filtrarPorCampeonato(0)

    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }


  onCampeonatoChange(campeonatoId: number) {
    this.selectedCampeonatoId = campeonatoId;
    this.filtrarPorCampeonato(); // Chama a função para atualizar a tabela após a seleção
  }
  
  filtrarPorCampeonato(pagiana = 0) {
    if (this.selectedCampeonatoId > 0) {

      this.filtro.pagina = pagiana;

      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('campeonatoFilter.id', this.selectedCampeonatoId)

      // Aqui busca etapas por campeonato (popular o select de pesquisa por etapa)
      this.etapaService.pesquisar({ ...this.filtro })
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

  onEtapaChange(etapaId: number) {
    this.selectedEtapaId = etapaId;
    this.filtrarPorEtapa(); // Chama a função para atualizar a tabela após a seleção
  }

  filtrarPorEtapa(pagiana = 0) {
    if (this.selectedEtapaId > 0) {

      this.filtro.pagina = pagiana;

      // Aqui busca a lista de provas por etapaId
      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('etapaFilter.id', this.selectedEtapaId)

      // Aqui busca provas por etapa (popular o select de pesquisa por prova)
      this.provaService.pesquisar({ ...this.filtro })
        .then(response => {
          this.provas = response.provas;
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
        //this.dadosProva = await this.provaService.getProvaById(this.selectedProvaId);
        // Aqui busca todas as inscricoes por prova 
        this.listar()
      } catch (error) {
        //this.dadosProva = null; // Limpa os dados em caso de erro
        //this.showToast('Erro ao carregar dados da prova.', 'danger');
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

    this.apuracaoService.apuracaoAndInscricao({ ...this.filtro })
      .then(response => {
        const apuracoes = response.apuracoes;
        this.source.load(apuracoes);

      }
    )
  }


  onAdd() {
    console.log('Add')
  }

  onEdit(event) {
    console.log('Edit')
  }

  onDelete(event): void {}


  // Aqui filtra pelo campo de busca do ng2 smart teble
  // Nova função para lidar com os filtros da tabela
  onTableFilter(filters: any) {
    let params = new HttpParams();
    
    // Garante que filters seja um array
    let filtersArray = (filters && filters.filters && Array.isArray(filters.filters)) ? filters.filters : [];

    let nomeFilter = filtersArray.find(f => f.field === 'atletaNome');
    let serieFilter = filtersArray.find(f => f.field === 'serie');

    if (nomeFilter && nomeFilter.search) {
      params = params.set('provaId',this.selectedProvaId);
      params = params.set('atletaNome',nomeFilter.search);
    }

    if (serieFilter && serieFilter.search) {
      params = params.set('provaId',this.selectedProvaId);
      params = params.set('serie',serieFilter.search);
    }
    this.filtro.params = params;
    
    this.apuracaoService.apuracaoAndInscricao({...this.filtro, params: params})
    .then(response => {
      const apuracoes = response.apuracoes;
      this.source.load(apuracoes);
    });
  }

  async handleResultCommit(event: { value: string | null, rowData: any }): Promise<void> {
      console.log('Pai recebeu valueCommit:', event);

      const { value, rowData } = event;

      // --- 1. Validação dos Dados Necessários ---
    if (!rowData || rowData.apuracaoId === undefined || rowData.inscricaoId === undefined || 
                    rowData.provaId === undefined || rowData.atletaId === undefined) {
      console.error("Dados da linha incompletos (id, provaId, atletaId). Impossível salvar.", rowData);
      this.showToast('Erro interno: Dados da linha incompletos.', 'danger');
      return;
    }

    // --- 2. Preparar dados para salvar ---
    const idApuracao = rowData.apuracaoId ?? 0;

    // --- 3. Atualizar LocalDataSource (Otimista) ---
    // Atualiza a coluna 'resultado' no objeto que será usado para a UI.
    // Note que o 'resultadoMillis' é o que vai pro backend, mas a UI mostra a string 'value'.
    const updatedDataForUI = { ...rowData, resultado: value }; // Usa a string formatada para UI
    try {
        await this.source.update(rowData, updatedDataForUI);
        console.log('LocalDataSource atualizado com:', value);
    } catch (err) {
        console.error('Erro ao atualizar LocalDataSource:', err);
        // Considerar parar aqui se a UI não puder ser atualizada
        this.showToast('Erro ao atualizar dados na tabela.', 'danger');
        return;
    }

    // --- 4. Chamar Serviço (Insert ou Update) ---
    try {
      if (idApuracao === 0) {
        // --- INSERT ---
        
        const addApuracao: Apuracao = {
          // id: null, // O backend deve gerar
          empresaId: 1, // Definido no serviço, mas pode ser setado aqui se preferir
          inscricaoId: rowData.inscricaoId,
          provaId: rowData.provaId,
          atletaId: rowData.atletaId, // <<< Certifique-se que atletaId está em rowData
          pontuacaoId: 1,
          resultado: value, // Envia o valor em milissegundos
          tipoInscricao: rowData.tipoInscricao,
          status: 3, // Ou 'PENDENTE' ou outro status inicial padrão
          // Adicione outros campos necessários se o modelo Apuracao exigir
        };

        //console.log('Tentando criar apuração...', novaApuracao);

        const apuracaoCriada = await this.apuracaoService.create(addApuracao).toPromise();
        this.showToast('Resultado salvo com sucesso!', 'success');
      } else {
        // --- UPDATE ---
        console.log(`Tentando atualizar apuração ID: ${idApuracao}...`);
        const updApuracao: Apuracao = {
          id: idApuracao,
          resultado: value, // Envia o novo resultado em milissegundos
          tipoInscricao: rowData.tipoInscricao 
        };

        await this.apuracaoService.updateResultado(updApuracao).toPromise();
        this.showToast('Resultado atualizado com sucesso!', 'success');
        // A UI já foi atualizada otimisticamente antes da chamada do serviço
      }
    } catch (error) {
        console.error("Erro ao salvar/atualizar apuração:", error);
        this.showToast('Erro ao salvar resultado no servidor.', 'danger');
        // *** Reverter a atualização otimista da UI em caso de erro ***
        try {
            // Usa o 'rowData' original (antes da edição) para reverter
            await this.source.update(updatedDataForUI, rowData);
            console.log('Reversão do LocalDataSource devido a erro no salvamento.');
        } catch (revertError) {
            console.error('Erro ao tentar reverter LocalDataSource:', revertError);
            // Se a reversão falhar, a UI pode ficar inconsistente. Talvez recarregar?
        }
    }
  }

  showToast(message: string, status: string) {
    const config: Partial<NbToastrConfig> = {
      status: status,
      duration: 3000,
      preventDuplicates: true,
    };
    this.toastrService.show(message, '', config);
  }

}
