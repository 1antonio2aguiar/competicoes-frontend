import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocaisCompeticoes } from '../../../shared/models/locaisCompeticoes';
import { LocaisCompeticoesSelectService  } from './locais-competicoes-select.service';


@Component({
  selector: 'ngx-locais-competicoes-select',
  template: `
    <nb-select 
      placeholder="Locais competições"
      status="info"
      [(selected)]="selectedItem" 
      [fullWidth]="true"
      (selectedChange)="onlocaisCompeticoesServiceChange($event)"
      #selectComponent
      [disabled]="readOnly"
    >
      <nb-option *ngFor="let localCompeticao of locaisCompeticoes" [value]="localCompeticao.id">
        {{ localCompeticao.nome }}
      </nb-option>
    </nb-select>
  `,
  styleUrls: ['./locais-competicoes-select.component.scss']
})

export class LocalCompeticaoSelectComponent implements OnInit {

  @Input() cell: any; // Recebe a célula atual do ng2-smart-table
  @Input() readOnly: boolean = false; // Adiciona uma propriedade para controlar a edição

  locaisCompeticoes: LocaisCompeticoes[] = [];
  selectedItem: number;

  constructor(private locaisCompeticoesSelectService: LocaisCompeticoesSelectService,
  ) {
  }

  /*async ngOnInit() {
    this.locaisCompeticoes = await this.loadLocaisCompeticoes();
    // Inicializa selectedItem com o valor da célula (se houver)
    this.selectedItem = this.cell.newValue || null;
  }*/

  async ngOnInit() {
    this.locaisCompeticoes = await this.loadLocaisCompeticoes();

    // Inicializa selectedItem com o valor da célula (se houver)
    // Verifica se o valor da célula é um objeto modalidade
    if (this.cell.newValue && this.cell.newValue.id) {
      this.selectedItem = this.cell.newValue.id; // Se for, pega o id da modalidade
      this.readOnly = false;
    } else {
      this.selectedItem = this.cell.newValue || null; // Se não for, utiliza o valor padrão
      this.readOnly = false;
    }
    
  }

  async loadLocaisCompeticoes() {
    try {
      return await this.locaisCompeticoesSelectService.listAll();
    } catch (error) {
      console.error('Erro ao carregar local Competicão', error);
      return []; // Retorne um array vazio caso ocorra um erro
    }
  }

  onlocaisCompeticoesServiceChange(newLocalCompeticao: number) {
    this.cell.newValue = newLocalCompeticao; // Salva o valor na célula
  }

}
