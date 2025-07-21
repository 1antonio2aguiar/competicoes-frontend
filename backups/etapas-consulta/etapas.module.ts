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
import { NbMomentDateModule } from '@nebular/moment';


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
} from '@nebular/theme';

import { FormsRoutingModule } from '../forms/forms-routing.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { CampeonatosSelectModule } from "../campeonatos/campeonatos-select/campeonatos-select.module";


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
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    FormsRoutingModule,
    ngFormsModule,
    CampeonatosSelectModule,
    NbMomentDateModule
],
  declarations: [
    ...etapasRoutedComponents,
  ],

  entryComponents: [ DataEditorComponent, DataEditorRenderComponent ],
  
})

export class EtapasModule { }

