import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Campeonato } from '../../../shared/models/campeonato';
import { CampeonatosService } from '../campeonatos.service';


@Component({
  selector: 'ngx-campeonato-select',
  template: `
    <nb-select 
      placeholder="Campeonatos"
      status="info"
      [(selected)]="selectedItem" 
      [fullWidth]="true"
      (selectedChange)="onCampeonatoChange($event)"
      #selectComponent
    >
      <nb-option *ngFor="let campeonato of campeonatos" [value]="campeonato.id">
        {{ campeonato.nome }}
      </nb-option>
    </nb-select>
  `,
  styleUrls: ['./campeonatos-select.component.scss']
})

export class CampeonatoSelectComponent implements OnInit {
  
  @Input() cell: any; // Recebe a célula atual do ng2-smart-table
  
  campeonatos: Campeonato[] = [];
  selectedItem: number;

  constructor(private campeonatosService: CampeonatosService) {
  }

  async ngOnInit() {
    this.campeonatos = await this.loadCampeonatos();
    // Inicializa selectedItem com o valor da célula (se houver)
    this.selectedItem = this.cell.newValue || null;
  }

  async loadCampeonatos() {
    try {
      return await this.campeonatosService.listAll();
    } catch (error) {
      console.error('Erro ao carregar campeonatos', error);
      return []; // Retorne um array vazio caso ocorra um erro
    }
  }

  onCampeonatoChange(newCampeonato: number) {
    this.cell.newValue = newCampeonato; // Salva o valor na célula
  }

}

