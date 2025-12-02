import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
import { NbDialogService, NbWindowControlButtonsConfig} from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { Prova } from '../../../shared/models/prova';
import { Inscricao } from '../../../shared/models/inscricao';

import { Filters } from '../../../shared/filters/filters';
import { Atleta } from '../../../shared/models/atleta';
import { InscricoesService } from '../inscricoes.service';
import { FormatarTempoService } from '../../../shared/services/formatar-tempo.service';
import { AtletasBuscaComponent } from '../../components/atletas/atletas-busca/atletas-busca.component';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'ngx-inscricoes-iud',
  templateUrl: './inscricoes-iud.component.html',
  styleUrls: ['./inscricoes-iud.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [NbDialogService]
}) 

export class InscricoesIudComponent implements OnInit{
  source: LocalDataSource = new LocalDataSource();
  width = 700; // Define a largura do modal
  @Input() mode: 'add' | 'edit';
  @Input() telaOrigem;
  @Input() prova;
  @Input() dadosProva;

  serie  = 'serie'  + Math.random(); 
  baliza = 'baliza' + Math.random(); 
  status = 'status' + Math.random(); 
  statusTipoInscricao = 'statusTipoInscricao' + Math.random(); 

  inscricaoForm: FormGroup;
  filtro: Filters       = new Filters();
  loading               = false;
  isLoadingBalizaSerie  = false;

  provas: Prova[] = [];
  atletas: Atleta[] = [];
  inscricoes: Inscricao[] = [];

  @Input() inscricao: Inscricao | undefined;
  @Input() atleta: Atleta | undefined;
  @Output() inscricaoSalvaOuAtualizada = new EventEmitter<any>();
  editingField: 'atleta' | 'equipe' | null = null; // Adicionado
  
  @Input() numeroTotalBalizas: number = 0;
  balizasDisponiveis: { value: number; label: number }[] = [];
  
  statusSelect = [
    { value:  0 ,  selected: false, label: 'Inscrito'},
    { value:  1,  selected: false, label: 'Confirmado'},
    { value:  2,  selected: false, label: 'Presente'},
    { value:  3,  selected: false, label: 'Ausente'},
    { value:  4,  selected: false, label: 'Desclassificado (DSQ)'},
    { value:  5, selected:false,  label: 'Desistiu (WD)'},
    { value:  6, selected:false,  label: 'Apurado'}
  ];

  statusTipoInscricaoSelect = [
    { value:  0, selected: false, label: 'Classificatória'},
    { value:  1, selected: false, label: 'Semifinal'},
    { value:  2, selected: false, label: 'Final'}
  ];
  
  constructor(
      private inscricaoService: InscricoesService,
      private formBuilder: FormBuilder,
      private ref1: NbWindowRef,
      private windowService: NbWindowService,
      private authService: AuthService,
    ) { 
      this.filtro.pagina = 1;
      this.filtro.itensPorPagina = 10;
  }

  ngOnInit() {

    if (this.dadosProva && this.dadosProva.etapa && this.dadosProva.etapa.qtdBalizas) {
        this.numeroTotalBalizas = this.dadosProva.etapa.qtdBalizas;
    } else {
        this.numeroTotalBalizas = 8; // Um valor padrão seguro
    }

    // 1. Crie o formulário ANTES de qualquer lógica de dados
    this.criarFormulario();

    // 2. POPULE A LISTA COMPLETA DE BALIZAS DISPONÍVEIS (para o select)
    // Faça isso para ambos os modos, pois o select precisa das opções
    this.balizasDisponiveis = [];
    const balizasIniciais: { value: number; label: number }[] = []; // Variável local temporária
    this.numeroTotalBalizas = this.numeroTotalBalizas;

    //this.numeroTotalBalizas = this.dadosProva.prova.qtdBalizas;
    for (let i = 1; i <= this.numeroTotalBalizas; i++) {
      balizasIniciais.push({ value: i, label: i });
    }
    this.balizasDisponiveis = [...balizasIniciais];

    
    // 3. Lógica específica para cada modo
    if (this.mode === 'add') {
      //console.log('Modo Add ', this.dadosProva);
      // Lógica para buscar inscrições existentes e calcular próxima série/baliza
      if (this.dadosProva.id > 0) {
        this.filtro.pagina = 0; // Geralmente a primeira página é 1, mas depende da API
        this.filtro.itensPorPagina = 1000; // Pegue muitos para calcular corretamente

        this.filtro.params = new HttpParams();
        this.filtro.params = this.filtro.params.append('provaId', this.prova.toString()); // Converta para string
        // Adicione ordenação se a API suportar, para garantir a lógica de série/baliza
        // this.filtro.params = this.filtro.params.append('sort', 'serie,asc');
        // this.filtro.params = this.filtro.params.append('sort', 'baliza,asc');
        
        this.isLoadingBalizaSerie = true;
        this.inscricaoService.pesquisar({ ...this.filtro })
          .then(response => {
            // <<< CHAMADA AO NOVO MÉTODO >>>
            const calculo = this._calcularProximaSerieBaliza(response.inscricoes || [], balizasIniciais);

            // <<< ATUALIZA A PROPRIEDADE DA CLASSE COM O RESULTADO FILTRADO >>>
            this.balizasDisponiveis = calculo.balizasDisponiveis;
            let proximaSerie = 1;
            let balizasDisponiveisCalculadas = [...this.balizasDisponiveis]; // Copia a lista completa

            this.balizasDisponiveis = balizasDisponiveisCalculadas;

            // Define o valor inicial do formControl com base no cálculo
            if (this.balizasDisponiveis.length > 0) {
              this.inscricaoForm.patchValue({
                // Usa a primeira baliza da lista filtrada retornada
                baliza: this.balizasDisponiveis[0].value,
                // Usa a série calculada retornada
                serie: calculo.proximaSerie,
              });
            } else {
              this.inscricaoForm.patchValue({ serie: calculo.proximaSerie }); // Define pelo menos a série
              this.inscricaoForm.get('baliza').reset(); // Limpa o select de baliza
            }

          })
          .finally(() => {
            // <<< Flag é definida como false >>>
            this.isLoadingBalizaSerie = false;
          })
          .catch(error => {
            console.error("Erro ao buscar inscrições para cálculo inicial:", error);
            this.inscricaoForm.patchValue({ serie: 1 }); // Define padrão em caso de erro
            this.balizasDisponiveis = [...balizasIniciais]; // Mantém todas as balizas em caso de erro na busca
          })
          .finally(() => {
            // <<< Definir flag como FALSE ao final, SEMPRE >>>
            console.log("Processo de série/baliza finalizado (isLoading = false)"); // Log
        });
      } else {
        console.warn("Prova ID não definido no modo 'add'.");
        this.inscricaoForm.patchValue({ serie: 1 });
        this.balizasDisponiveis = [...balizasIniciais]; // Usa todas as balizas se não houver provaId
      }
      // Lógica para atleta pré-definido (se houver)
      if (this.atleta) {
        this.inscricaoForm.get('atleta').patchValue(this.atleta);
      }

    } else if (this.mode === 'edit' && this.inscricao) {
      
      const dadosParaFormulario = {
        ...this.inscricao, // Copia todos os campos planos (id, baliza, serie, status, etc.)

        // 2. Crie o objeto 'atleta' aninhado que o formulário espera.
        atleta: {
          id: this.inscricao.atletaId,
          nome: this.inscricao.atletaNome
        }
      };

      // No modo de edição, não precisamos calcular a próxima vaga.
      // Apenas populamos o form e garantimos que a baliza selecionada esteja na lista completa.
      this.inscricaoForm.patchValue(dadosParaFormulario);

    } else if (this.mode === 'edit' && !this.inscricao) {
      console.error("Modo de edição, mas sem dados de inscrição.");
      // Fechar modal ou mostrar erro
    }
  }
  // Fim ngOnInit.

  criarFormulario() {
    this.inscricaoForm = this.formBuilder.group({
      id: [null],
      empresa: [this.authService.getEmpresaId(),Validators.required], // Valor padrão ou pegar de algum lugar?
      observacao: [null],
      provaId: [this.prova, [Validators.required]], // Garanta que this.prova tem valor
      
      serie: [null, [Validators.required]],
      // Inicializa com null, será preenchido pelo ngOnInit
      baliza: [null, [Validators.required]],
      // Inicializa com 1 (Inscrito) para 'add', será sobrescrito por patchValue em 'edit'
      status: [0, Validators.required], // Simplificado - o patchValue cuidará do 'edit'

      statusTipoInscricao: [0, Validators.required],

      atleta: this.formBuilder.group({
          id:[null, Validators.required],
          nome:[null] // readonly no HTML, preenchido via modal/patchValue
      }),

      record: [null],
    });
  };

  salvarInscricao() {
    
    if (this.inscricaoForm.valid) {
      const inscricaoData = this.inscricaoForm.getRawValue();

      const empresaId = this.authService.getEmpresaId();
      this.filtro.params = this.filtro.params.set('empresaId', empresaId.toString());
      
      //inscricaoData.atletaId = inscricaoData.atleta; // Aqui extraímos o valor da categoria selecionada
      //delete inscricaoData.atleta; // Removemos a propriedade categoria, pois é um objeto desnecessário na requisição
      inscricaoData.atletaId = inscricaoData.atleta.id;
      inscricaoData.provaId  = this.prova;
      inscricaoData.empresaId  = empresaId;

      // Se tiver ID, atualiza, senão salva
      const inscricaoObservable = inscricaoData.id
      ? this.inscricaoService.update(inscricaoData)
      : this.inscricaoService.create(inscricaoData);


      inscricaoObservable.subscribe(
        (inscricaoSalva) => {
          this.inscricaoSalvaOuAtualizada.emit('atualizado');
          this.fecharJanelaModal('save');
          console.log('Inscricao salva/atualizada com sucesso!', inscricaoSalva);
         
        },
        (error) => {
          console.error('Erro ao salvar/atualizar Inscricao:', error);
        }
      );
    }
  } 
  
  fecharJanelaModal(reason: string = '') { 
    this.ref1.close(reason); 
  } 

  showAtletasModal(botao: 'atleta') {
      this.editingField = botao; // Define qual campo está sendo editado
  
      const buttonsConfig: NbWindowControlButtonsConfig = {
        minimize: false,
        maximize: false,
        fullScreen: true,
        close: true
      };

      const modalRef = this.windowService.open(AtletasBuscaComponent, { 
        title: `Buscar Atletas`,
        buttons: buttonsConfig, 
        context: { 
          telaOrigem: 'Inscricoes',
          provaId: this.dadosProva.id
        },
        closeOnBackdropClick: false, // Impede que o diálogo feche ao clicar fora
      });
    
      modalRef.onClose.subscribe(
        (atleta) => {
          if (atleta && this.editingField) {
            this.inscricaoForm.patchValue({ [this.editingField]: { id: atleta.id, nome: atleta.nome } });
            this.editingField = null;  // Reseta o campo
        }
        },
        (error) => {
          console.error('Erro ao abrir ou fechar o modal:', error);
          this.editingField = null;
      }
    );
  }


  showEquipesModal(botao: 'equipe') {
      this.editingField = botao; // Define qual campo está sendo editado
  }

  showPessoasModal(botao: 'pessoa') {
   // this.editingField = botao; // Define qual campo está sendo editado

  } 
  
  private _calcularProximaSerieBaliza(
    inscricoesExistentes: Inscricao[],
    balizasIniciais: { value: number; label: number }[]
  ): { proximaSerie: number; balizasDisponiveis: { value: number; label: number }[] } {

    //console.log('Calculando próxima série/baliza com:', inscricoesExistentes, balizasIniciais);
    let proximaSerie = 1;
    // Começa assumindo que todas as balizas iniciais estão disponíveis para a série 1
    let balizasDisponiveisCalculadas = [...balizasIniciais];

    // Verifica se existem inscrições para processar
    if (inscricoesExistentes && Array.isArray(inscricoesExistentes) && inscricoesExistentes.length > 0) {
        // Ordena as inscrições por série e depois por baliza
        inscricoesExistentes.sort((a, b) => {
            if (a.serie !== b.serie) {
                return a.serie - b.serie;
            }
            return a.baliza - b.baliza;
        });

        const ultimaInscricao = inscricoesExistentes[inscricoesExistentes.length - 1];
        proximaSerie = ultimaInscricao.serie; // Assume a última série encontrada

        // Filtra balizas ocupadas especificamente na última série encontrada
        const balizasOcupadasUltimaSerie = inscricoesExistentes
            .filter(insc => insc.serie === proximaSerie)
            .map(insc => insc.baliza);

        //console.log(`Última série encontrada no cálculo: ${proximaSerie}, Balizas ocupadas:`, balizasOcupadasUltimaSerie);

        // Calcula as balizas livres NESSA série específica
        balizasDisponiveisCalculadas = balizasIniciais.filter(
            b => !balizasOcupadasUltimaSerie.includes(b.value)
        );

        // Se a última série estiver cheia E houver balizas possíveis na prova, avança para a próxima série
        if (balizasDisponiveisCalculadas.length === 0 && balizasIniciais.length > 0) {
            proximaSerie++;
            balizasDisponiveisCalculadas = [...balizasIniciais]; // Na nova série, todas as balizas estão livres novamente
            console.log(`Cálculo: Nenhuma baliza livre na série ${proximaSerie - 1}. Avançando para série ${proximaSerie}.`);
        } else {
             console.log(`Cálculo: Balizas disponíveis na série ${proximaSerie}:`, balizasDisponiveisCalculadas);
        }
    } else {
         console.log('Cálculo: Nenhuma inscrição anterior, usando Série 1.');
         // balizasDisponiveisCalculadas já contém todas as balizas iniciais
    }

    // Retorna o resultado calculado
    return {
        proximaSerie: proximaSerie,
        balizasDisponiveis: balizasDisponiveisCalculadas
    };
  }

}
