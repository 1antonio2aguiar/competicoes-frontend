import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbWindowControlButtonsConfig} from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbWindowService } from '@nebular/theme';

import { Prova } from '../../../shared/models/prova';
import { Categoria } from '../../../shared/models/categoria';

import { ProvasService } from '../provas.service';
import { CampeonatosService } from '../../campeonatos/campeonatos.service';
import { EtapasService } from '../../etapas/etapas.service';
import { CategoriasService } from '../../categorias/categorias.service';
import { TiposNadoService } from '../../tipos-nado/tipos-nado.service';
import { TiposNado } from '../../../shared/models/tiposNado';
import { Etapa } from '../../../shared/models/etapa';
import { Campeonato } from '../../../shared/models/campeonato';
import { Filters } from '../../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { FormatarTempoService } from '../../../shared/services/formatar-tempo.service';
//import { TempoFormatadoPipe } from '../../../shared/pipes/tempo-formatado.pipe';

@Component({
  selector: 'ngx-provas-iud',
  templateUrl: './provas-iud.component.html',
  styleUrls: ['./provas-iud.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NbDialogService]
})

export class ProvasIudComponent implements OnInit {
  provaId: number = 0;
  width = 700; // Define a largura do modal
  @Input() mode: 'add' | 'edit';
  selectedCampeonatoId: number;

  indiceTecnicoFormatado: string | null = null;

  revezamento = 'revezamento' + Math.random(); 
  tipoPiscinaName = 'tipoPiscinaName' + Math.random(); 
  medley = 'medley' + Math.random(); 
  genero      = 'genero' + Math.random();

  provaForm: FormGroup;
  filtro: Filters = new Filters();
  
  campeonatos: Campeonato[] = []
  etapas: Etapa[] = [];
  categorias: Categoria[] = [];
  tiposNado: TiposNado[] = [];

  @Output() provaSalvaOuAtualizada = new EventEmitter<any>();
  @Input() prova: Prova | undefined;
  //editingField: 'pessoa' | 'equipe' | null = null; // Adicionado

  distanciaSelect = [
    { value:  50 ,  selected: false, label: '50 Metros'},
    { value:  100,  selected: false, label: '100 Metros'},
    { value:  200,  selected: false, label: '200 Metros'},
    { value:  400,  selected: false, label: '400 Metros'},
    { value:  800,  selected: false, label: '800 Metros'},
    { value:  1500, selected:false,  label: '1500 Metros'}
  ];

  constructor(
    private provaService: ProvasService,
    private campeonatoService: CampeonatosService,
    private etapaService: EtapasService,
    private categoriaService: CategoriasService,
    private tipoNadoService: TiposNadoService,
    private formBuilder: FormBuilder,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private ref1: NbWindowRef,
    private formatarTempoService: FormatarTempoService,
    //private tempoFormatadoPipe: TempoFormatadoPipe,
  ) { 
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }

  ngOnInit() {
    this.carregarCampeonatos();
    this.onCampeonatoChange(0);
    this.carregarCategorias();
    this.carregarTiposNado();

    this.criarFormulario();

    if (this.mode === 'edit' && this.prova) { // Verifica se a atleta foi passada como input
      this.provaForm.patchValue(this.prova); // Preenche o formulário com os dados da atleta

      // Atualiza o array distanciaSelect para marcar o item correto como selecionado
      this.distanciaSelect = this.distanciaSelect.map(item => {
        return {
          ...item,
          selected: item.value === this.prova.distancia
        };
      });
    }

  };

  carregarCampeonatos() {
    this.campeonatoService.listAllList()
      .then(campeonato => {
        this.campeonatos = campeonato;
      })
      .catch(error => {
        console.error("Erro ao carregar categorias:", error);
    });
  }

  carregarCategorias() {
    this.categoriaService.listAll()
      .then(categorias => {
        this.categorias = categorias;
      })
      .catch(error => {
        console.error("Erro ao carregar categorias:", error);
    });
  }

  carregarTiposNado() {
    this.tipoNadoService.listAll()
      .then(tipoNado => {
        this.tiposNado = tipoNado;
      })
      .catch(error => {
        console.error("Erro ao carregar categorias:", error);
    });
  }

  criarFormulario() {
    this.provaForm = this.formBuilder.group({
      id: [null],
      empresa: [1],
      observacao: [null],
      genero: [null, [Validators.required]],
      revezamento: ['N', [Validators.required]],
      medley: ['N', [Validators.required]],
      tipoPiscina: ['L', [Validators.required]],

      indiceTecnico: [null],
      record: [null],

      distancia: [this.mode === 'edit' && this.prova ? this.prova.distancia : null, Validators.required],
      
      campeonato:[this.mode === 'edit' && this.prova ? this.prova.campeonatoId : null, Validators.required],
      categoria: [this.mode === 'edit' && this.prova ? this.prova.categoriaId : null, Validators.required],
      etapa: [this.mode === 'edit' && this.prova ? this.prova.etapaId : null, Validators.required],
      tipoNado: [this.mode === 'edit' && this.prova ? this.prova.tipoNadoId : null, Validators.required],

    });
  };

  fecharJanelaModal(reason: string = '') { 
    this.ref1.close(reason); 
  }

  salvarProva() {
    
    if (this.provaForm.valid) {
      const provaData = this.provaForm.getRawValue();

      provaData.categoriaId = provaData.categoria; // Aqui extraímos o valor da categoria selecionada
      delete provaData.categoria; // Removemos a propriedade categoria, pois é um objeto desnecessário na requisição
      provaData.tipoNadoId = provaData.tipoNado; 
      delete provaData.tipoNado;
      provaData.etapaId = provaData.etapa; 
      delete provaData.etapa;

      // Se tiver ID, atualiza, senão salva
      const provaObservable = provaData.id
      ? this.provaService.update(provaData)
      : this.provaService.create(provaData);

      provaObservable.subscribe(
        (provaSalva) => {
          this.provaSalvaOuAtualizada.emit('atualizado');
          this.fecharJanelaModal('save');
          console.log('Atleta salva/atualizado com sucesso!', provaData);
         
        },
        (error) => {
          console.error('Erro ao salvar/atualizar atleta:', error);
        }
      );
    }
  }

  onCampeonatoChange(campeonatoId: number) {
    this.selectedCampeonatoId = campeonatoId;
    //console.log('no on change ' , this.selectedCampeonatoId )
    this.filtrarEtapas(); // Chama a função para atualizar a tabela após a seleção
  }

  filtrarEtapas(pagiana = 0) {

    if(this.selectedCampeonatoId > 0){

      this.filtro.pagina = pagiana;
  
      this.filtro.params = new HttpParams();
      this.filtro.params = this.filtro.params.append('campeonatoFilter.id', this.selectedCampeonatoId)
  
      this.etapaService.pesquisar({...this.filtro})
          .then(response => {
            this.etapas = response.etapas;
      });
    } else {
      this.etapaService.listAll()
        .then(etapa => {
          this.etapas = etapa;
        })
        .catch(error => {
          console.error("Erro ao carregar categorias:", error);
        });
    }
  }

  formatarTempo(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const formControlName = inputElement.dataset['formControlName'];

    if (formControlName) {
        const valor = inputElement.value;
        const valorFormatado = this.formatarTempoService.formatarTempo(valor);
        const control = this.provaForm.get(formControlName);
        this.formatarTempoService.atualizarFormControl(control, valorFormatado);
    }
  }

}
