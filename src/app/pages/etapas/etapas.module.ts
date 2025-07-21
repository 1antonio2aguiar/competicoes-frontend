import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { etapasRoutedComponents, EtapasRoutingModule } from './etapas-routing.module';
import { CampeonatosModule } from '../campeonatos/campeonatos.module';
import { LocaisCompeticoesModule } from '../locais-competicoes/locais-competicoes.module';
import { DataEditorComponent } from './data-editor/data-editor.component';
import { DataEditorRenderComponent } from './data-editor/data-editor.component';

import { FullScreenStyleDirective, SelectStyleDirective } from './estapas-iud/full-screen-style.directive';


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
  NbToastrModule ,
  NbButtonGroupModule,
} from '@nebular/theme';

import { FormsRoutingModule } from '../forms/forms-routing.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { CampeonatosSelectModule } from "../campeonatos/campeonatos-select/campeonatos-select.module";
import { EstapasIudComponent } from './estapas-iud/estapas-iud.component';


@NgModule({
  imports: [  
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    EtapasRoutingModule,
    Ng2SmartTableModule,
    CampeonatosModule,
    LocaisCompeticoesModule,
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
    FormsRoutingModule,
    ngFormsModule,
    NbToastrModule.forRoot() ,
    CampeonatosSelectModule
],
  declarations: [
    ...etapasRoutedComponents,
    EstapasIudComponent,
    FullScreenStyleDirective,
    SelectStyleDirective
  ],

  entryComponents: [ DataEditorComponent, DataEditorRenderComponent ],
  
})

export class EtapasModule { }
