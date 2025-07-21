import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef } from '@nebular/theme';

import { Campeonato } from '../../../shared/models/campeonato';
import { CampeonatosSelectService } from '../../campeonatos/campeonatos-select/campeonatos-select.service';
import { LocaisCompeticoes } from '../../../shared/models/locaisCompeticoes';
import { LocaisCompeticoesSelectService } from '../../locais-competicoes-bkp/locais-compticoes-select/locais-competicoes-select.service';
import { EtapasService } from '../etapas.service';
import { Etapa } from '../../../shared/models/etapa';
import EtapaOutput from '../../../shared/models/etapaOutput';

//EtapasPesquisaComponent 

@Component({
  selector: 'ngx-estapas-iud',
  templateUrl: './estapas-iud.component.html',
  styleUrls: ['./estapas-iud.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EstapasIudComponent implements OnInit{
  etapaId: number = 0;
  width = 700; // Define a largura do modal
  @Input() mode: 'add' | 'edit';
	
  etapaForm: FormGroup;
  
  campeonatos: Campeonato[] = [];
  locaisCompeticoes: LocaisCompeticoes[] = [];

  pontuaName = 'pontua' + Math.random(); 
  acumulaName = 'acumula' + Math.random(); 
  @Output() etapaSalvaOuAtualizada = new EventEmitter<any>();
  @Input() etapa: EtapaOutput | undefined;

  constructor(public windowRef: NbWindowRef,
    private campeonatosService: CampeonatosSelectService,
    private locaisCompeticoesService: LocaisCompeticoesSelectService,
    private etapasService: EtapasService,
    private formBuilder: FormBuilder
  ) { }

  criarFormulario() {
    this.etapaForm = this.formBuilder.group({
      id: [null],
      empresa: [1],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      campeonato: [null, Validators.required],
      localCompeticao: [null, Validators.required],
      dataEtapa: [null, Validators.required],
      dataInscricao: [null, Validators.required],
      pontua: ['S'], 
      acumula: ['S'], 
      descricao: [null]
    });
  }

  ngOnInit() {
    this.carregarCampeonatos();
    this.carregarLocaisCompeticoes();
    this.criarFormulario();

    if (this.mode === 'edit' && this.etapa) { // Verifica se a equipe foi passada como input
      //Formata as datas corretamente (YYYY-MM-DD):')
      console.log('Mode: ', this.mode)
      this.etapa.dataEtapa = this.etapa.dataEtapa ? new Date(this.etapa.dataEtapa).toISOString().slice(0, 10) : null;
      this.etapa.dataInscricao = this.etapa.dataInscricao ? new Date(this.etapa.dataInscricao).toISOString().slice(0, 10) : null;

      this.etapaForm.patchValue(this.etapa); // Preenche o formulário com os dados da equipe
    }
  }

  carregarCampeonatos() {
    this.campeonatosService.listAll()
      .then(campeonatos => {
        this.campeonatos = campeonatos;
      })
      .catch(error => {
        console.error("Erro ao carregar campeonatos:", error);
        // Lide com o erro apropriadamente, ex: exibindo uma mensagem para o usuário
      });
  }

  carregarLocaisCompeticoes() {
    this.locaisCompeticoesService.listAll().subscribe({
      next: (locaisCompeticoes) => {
        //console.log("locais competicoes do service", locaisCompeticoes);
        this.locaisCompeticoes = locaisCompeticoes; // Certifique-se de que a variável esteja correta
      },
      error: (error) => {
        console.error("Erro ao carregar locais competições:", error);
        // Lide com o erro apropriadamente, ex: exibindo uma mensagem para o usuário
      }
    });
  }

  salvarEtapa() {
    if (this.etapaForm.valid) {
      const etapa: Etapa = this.etapaForm.value;

      if (etapa.id) {
        // Atualizar etapa existente
        this.etapasService.update(etapa).subscribe({
          next: (etapaAtualizada) => {
            console.log('Etapa atualizada:', etapaAtualizada);
            this.fecharModal('atualizado'); // Passa um motivo para o fechamento
          },
          error: (error) => {
            console.error('Erro ao atualizar etapa:', error);
            // Lide com o erro (ex: mensagem para o usuário)
          }
        });
      } else {
        // Criar nova etapa
        this.etapasService.create(etapa).subscribe({
          next: (novaEtapa) => {
            this.etapaSalvaOuAtualizada.emit({ tipo: 'criado', etapa: novaEtapa });
            this.fecharModal('criado'); // Passa um motivo para o fechamento
          },
          error: (error) => {
            console.error('Erro ao criar etapa:', error);
             // Lide com o erro (ex: mensagem para o usuário)
          }
        });
      }
    }
  }

  /*updateSingleSelectGroupValue(value: any) {
    // lógica para atualizar o valor (ex: this.valorSelecionado = value;)
    console.log('Valor selecionado:', value, ' ',this.etapaForm); // Adicione este console.log para depuração
  }*/

  fecharModal(reason: string = '') { // 'reason' é opcional
    console.log('Valor selecionado:', this.etapaForm);
    this.windowRef.close(reason); // Fecha o modal e passa o motivo
  }

}

