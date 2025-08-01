import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
import { NbDialogService, NbWindowControlButtonsConfig} from '@nebular/theme';

import { Modalidade } from '../../../shared/models/modalidade';
import { ModalidadesService } from '../../modalidades/modalidade-select/modalidades-select.service';
import { Equipe } from '../../../shared/models/equipe';
import { PessoasComponent } from '../../components/pessoas/pessoas-busca/pessoas.component';
import { EquipesService } from '../equipes.service';


@Component({
  selector: 'ngx-equipes-iud',
  templateUrl: './equipes-iud.component.html',
  styleUrls: ['./equipes-iud.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NbDialogService]
})

export class EquipesIudComponent implements OnInit{
  equipeId: number = 0;
  width = 700; // Define a largura do modal
  @Input() mode: 'add' | 'edit';
  @Input() telaOrigem;
	 
  equipeForm: FormGroup;

  modalidades: Modalidade[] = [];

  @Output() equipeSalvaOuAtualizada = new EventEmitter<any>();
  @Input() equipe: Equipe | undefined;
  editingField: 'agremiacao' | 'tecnico' | 'assistenteTecnico' | null = null; // Adicionado

  constructor(
    private modalidadesService: ModalidadesService,
    private equipeService: EquipesService,
    private formBuilder: FormBuilder,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    private ref1: NbWindowRef,
  ) { }

  ngOnInit() {
    this.carregarModalidades();
    this.criarFormulario();

    if (this.mode === 'edit' && this.equipe) { // Verifica se a equipe foi passada como input
      this.equipeForm.patchValue(this.equipe); // Preenche o formulário com os dados da equipe
    }
  };

  criarFormulario() {
    this.equipeForm = this.formBuilder.group({
      id: [null],
      empresa: [1],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      sigla: [null, [Validators.required, Validators.minLength(3)]],
      
      modalidade: [this.mode === 'edit' && this.equipe ? this.equipe.modalidadeId : null, Validators.required],

      tipoModalidade:
        this.formBuilder.group({
          id:[null],
          nome:[null]
        }), 
      
      agremiacao: 
        this.formBuilder.group({
          id:[null, Validators.required], 
          nome:[null]
      }),

      tecnico: 
        this.formBuilder.group({
          id:[null, Validators.required], 
          nome:[null]
      }),

      assistenteTecnico: 
        this.formBuilder.group({
          id:[null],
          nome:[null]
      }),
    });
  };

  carregarModalidades() {
    this.modalidadesService.listAll()
      .then(modalidades => {
        //console.log("Modalidades do service", modalidades);
        this.modalidades = modalidades;
        
      })
      .catch(error => {
        console.error("Erro ao carregar modalidades:", error);
    });
  }

  salvarEquipe() {
    
    if (this.equipeForm.valid) {
      const equipeData = this.equipeForm.getRawValue();

      equipeData.modalidadeId = equipeData.modalidade; // Aqui extraímos o valor da modalidade selecionada
      delete equipeData.modalidade; // Removemos a propriedade modalidade, pois é um objeto desnecessário na requisição
      equipeData.agremiacaoId = equipeData.agremiacao.id;
      equipeData.tecnicoId = equipeData.tecnico.id;
      equipeData.assistenteTecnicoId = equipeData.assistenteTecnico.id;

      // Se tiver ID, atualiza, senão salva
      const equipeObservable = equipeData.id
      ? this.equipeService.update(equipeData)
      : this.equipeService.create(equipeData);

      equipeObservable.subscribe(
        (equipeSalva) => {
          //this.equipeSalvaOuAtualizada.emit(equipeSalva);
          this.equipeSalvaOuAtualizada.emit('atualizado');
          this.fecharJanelaModal('save');
          console.log('Equipe salva/atualizada com sucesso!', equipeSalva);
         
        },
        (error) => {
          console.error('Erro ao salvar/atualizar equipe:', error);
        }
      );
    }
  }

  fecharJanelaModal(reason: string = '') { // 'reason' é opcional
    //console.log('Valor selecionado:', reason) //this.equipeForm;
    this.ref1.close(reason); 
    //this.ref1.close(); // Fecha o modal e passa o motivo
  }

  showPessoasModal(botao: 'agremiacao' | 'tecnico' | 'assistenteTecnico') {
    this.editingField = botao; // Define qual campo está sendo editado

    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true
    };

    const modalRef = this.windowService.open(PessoasComponent, { 
      buttons: buttonsConfig,
      context: { telaOrigem: 'Equipe' }, 
      closeOnBackdropClick: false, // Impede que o dialogo feche ao clicar fora
    });


    modalRef.onClose.subscribe(
      (pessoa) => {
        if (pessoa && this.editingField) {
          this.equipeForm.patchValue({ [this.editingField]: { id: pessoa.id, nome: pessoa.nome } });
          this.editingField = null;  // Reseta o campo
      }},
      (error) => {
        console.error('Erro ao abrir ou fechar o modal:', error);
        this.editingField = null;
      }
    );
  }
  
}
