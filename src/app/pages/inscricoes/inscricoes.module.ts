import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { inscricoesRoutedComponents, InscricoesRoutingModule } from './inscricoes-routing.module';
import { InscricoesComponent } from './inscricoes.component';
import { InscricoesPesquisaComponent } from './inscricoes-pesquisa/inscricoes-pesquisa.component';
import { InscricoesIudComponent } from './inscricoes-iud/inscricoes-iud.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';


import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { FormsRoutingModule } from '../forms/forms-routing.module';

import { 
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbTreeGridModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbSpinnerModule,
  NbButtonGroupComponent,
  NbButtonGroupModule,
} from '@nebular/theme';
import { AtletasBuscaComponent } from '../components/atletas/atletas-busca/atletas-busca.component';
import { AtletaPorNomeComponent } from '../components/atletas/atletas-busca/por-nome/atleta-por-nome.component';


@NgModule({
  declarations: [
    ...inscricoesRoutedComponents,
    InscricoesComponent,
    InscricoesPesquisaComponent,
    InscricoesIudComponent,
    AtletasBuscaComponent,
    AtletaPorNomeComponent
  ],
  imports: [
    CommonModule,

    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbThemeModule,
    FormsRoutingModule,
    ngFormsModule,

    NbSpinnerModule,
    
    InscricoesRoutingModule
  ]
})
export class InscricoesModule { }
