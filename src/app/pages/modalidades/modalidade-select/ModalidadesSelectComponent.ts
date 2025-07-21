import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Modalidade } from '../../../shared/models/modalidade';
import { ModalidadesService } from '../modalidades.service';


@Component({
  selector: 'app-modalidade-select',
  template: `
    <nb-select 
      placeholder="Modalidades"
      status="info"
      [(selected)]="selectedItem" 
      [fullWidth]="true"
      (selectedChange)="onModalidadeChange($event)"
      #selectComponent
      [disabled]="readOnly"
    >
      <nb-option *ngFor="let modalidade of modalidades" [value]="modalidade.id">
        {{ modalidade.nome }}
      </nb-option>
    </nb-select>
  `,
  styleUrls: ['./modalidades-select.component.scss']
})

export class ModalidadeSelectComponent implements OnInit {
  //@Output() modalidadeChanged = new EventEmitter<number>(); // Emite a modalidade selecionada

  @Input() cell: any; // Recebe a célula atual do ng2-smart-table
  @Input() readOnly: boolean = false; // Adiciona uma propriedade para controlar a edição
  
  modalidades: Modalidade[] = [];
  selectedItem: number;

  constructor(private modalidadesService: ModalidadesService) {
  }

  async ngOnInit() {
    this.modalidades = await this.loadModalidades();
    // Inicializa selectedItem com o valor da célula (se houver)
    this.selectedItem = this.cell.newValue || null;

    // Inicializa selectedItem com o valor da célula (se houver)
    // Verifica se o valor da célula é um objeto modalidade
    if (!this.cell.newValue) {
      this.selectedItem = this.cell.newValue.id; // Se for, pega o id da modalidade
      this.readOnly = false;
    } else {
      this.selectedItem = this.cell.newValue || null; // Se não for, utiliza o valor padrão
      this.readOnly = true;
    }
  }

  async loadModalidades() {
    try {
      return await this.modalidadesService.listAll();
    } catch (error) {
      console.error('Erro ao carregar modalidades', error);
      return []; // Retorne um array vazio caso ocorra um erro
    }
  }

  onModalidadeChange(newModalidade: number) {
    this.cell.newValue = newModalidade; // Salva o valor na célula
  }

}
