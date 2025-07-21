import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NbDialogService, NbWindowControlButtonsConfig} from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbWindowService } from '@nebular/theme';

import { Atleta } from '../../../shared/models/atleta';
import { PessoasService } from '../../equipes/pessoas/pessoas.service';
import { EquipesService } from '../../equipes/equipes.service';
import { CategoriasService } from '../../categorias/categorias.service';
import { Categoria } from '../../../shared/models/categoria';
import { AtletasService } from '../atletas.service';
//import { PessoasBuscaComponent } from '../../equipes/pessoas/pessoas-busca.component';

import { ModalidadesService } from '../../modalidades/modalidade-select/modalidades-select.service';
import { Modalidade } from '../../../shared/models/modalidade';
import { PessoasComponent } from '../../components/pessoas/pessoas-busca/pessoas.component';
import { EquipesBuscaComponent } from '../../components/equipes/equipes-busca/equipes-busca.component';

@Component({
  selector: 'ngx-atletas-iud',
  templateUrl: './atletas-iud.component.html',
  styleUrls: ['./atletas-iud.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [NbDialogService]
})


export class AtletasIudComponent {
  atletaId: number = 0;
  width = 700; // Define a largura do modal
  @Input() mode:       'add' | 'edit';
  @Input() telaOrigem;

  atletaForm: FormGroup;
  
  categorias: Categoria[] = [];

  @Output() atletaSalvaOuAtualizada = new EventEmitter<any>();
  @Input() atleta: Atleta | undefined;
  editingField: 'pessoa' | 'equipe' | null = null; // Adicionado

  constructor(
    private atletaService: AtletasService,
    private pessoaService: PessoasService,
    private equipeService: EquipesService,
    private categoriaService: CategoriasService,
    private modalidadesService: ModalidadesService,
    private formBuilder: FormBuilder,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private ref1: NbWindowRef,
  ) { }

  ngOnInit() {
    this.carregarCategorias();
    this.criarFormulario();

    //console.log("CONTEXT:", this.mode, ' ', this.telaOrigem); 

    if (this.mode === 'edit' && this.atleta) { // Verifica se a atleta foi passada como input
      //console.log('Atleta ', this.atleta)
      this.atletaForm.patchValue(this.atleta); // Preenche o formulário com os dados da atleta
      //console.log('Atleta form', this.atletaForm)
    }
  };

  carregarCategorias() {
    this.categoriaService.listAll()
      .then(categorias => {
        this.categorias = categorias;
        //console.log("cateroria do service", this.categorias);
        
      })
      .catch(error => {
        console.error("Erro ao carregar categorias:", error);
    });
  }

  criarFormulario() {
    this.atletaForm = this.formBuilder.group({
      id: [null],
      empresa: [1],
      observacao: [null],
      
      pessoa: 
        this.formBuilder.group({
          id:[null, Validators.required], 
          nome:[null]
      }),

      equipe: 
        this.formBuilder.group({
          id:[null, Validators.required], 
          nome:[null]
      }),

      categoria: [this.mode === 'edit' && this.atleta ? this.atleta.categoriaId : null, Validators.required],
      tipoCategoria:
        this.formBuilder.group({
          id:[null],
          descricao:[null]
      }),
    });
  };

  salvarAtleta() {
    
    if (this.atletaForm.valid) {
      const atletaData = this.atletaForm.getRawValue();

      atletaData.categoriaId = atletaData.categoria; // Aqui extraímos o valor da categoria selecionada
      delete atletaData.categoria; // Removemos a propriedade categoria, pois é um objeto desnecessário na requisição
      atletaData.pessoaId = atletaData.pessoa.id;
      atletaData.equipeId = atletaData.equipe.id;

      // Se tiver ID, atualiza, senão salva
      const atletaObservable = atletaData.id
      ? this.atletaService.update(atletaData)
      : this.atletaService.create(atletaData);

      atletaObservable.subscribe(
        (atletaSalva) => {
          this.atletaSalvaOuAtualizada.emit('atualizado');
          this.fecharJanelaModal('save');
          //console.log('Atleta salva/atualizado com sucesso!', atletaSalva);
         
        },
        (error) => {
          console.error('Erro ao salvar/atualizar atleta:', error);
        }
      );
    }
  }

  fecharJanelaModal(reason: string = '') { 
    this.ref1.close(reason); 
  }

  showPessoasModal(botao: 'pessoa') {
    this.editingField = botao; // Define qual campo está sendo editado

    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true
    };
  
    const modalRef = this.windowService.open(PessoasComponent, { 
      title: `Buscar Atletas`,
      buttons: buttonsConfig, 
      context: { telaOrigem: 'Atleta' }
    });
  
    modalRef.onClose.subscribe(
      (pessoa) => {
        if (pessoa && this.editingField) {
          this.atletaForm.patchValue({ [this.editingField]: { id: pessoa.id, nome: pessoa.nome } });
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

    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true
    };
  
      const modalRef = this.windowService.open(EquipesBuscaComponent, { buttons: buttonsConfig, });
  
    modalRef.onClose.subscribe(
      (equipe) => {
        if (equipe && this.editingField) {
          this.atletaForm.patchValue({ [this.editingField]: { id: equipe.id, nome: equipe.nome } });
          this.editingField = null;  // Reseta o campo
      }
      },
      (error) => {
        console.error('Erro ao abrir ou fechar o modal:', error);
        this.editingField = null;
      }
    );
  }
}
