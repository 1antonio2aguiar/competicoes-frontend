import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { FormsRoutingModule } from '../forms/forms-routing.module';

import { ApuracoesRoutingModule } from './apuracoes-routing.module';
import { ApuracoesComponent } from './apuracoes.component';
import { ApuracoesPesquisaComponent } from './apuracoes-pesquisa/apuracoes-pesquisa.component';

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
  NbButtonGroupComponent,
  NbButtonGroupModule,
} from '@nebular/theme';
import { ResultadoEditorComponent } from './apuracoes-pesquisa/components/resultado-editor.component';


@NgModule({
  declarations: [
    ApuracoesComponent,
    ApuracoesPesquisaComponent,
    ResultadoEditorComponent, ResultadoEditorComponent,
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

    ApuracoesRoutingModule
  ]
})

export class ApuracoesModule { }

