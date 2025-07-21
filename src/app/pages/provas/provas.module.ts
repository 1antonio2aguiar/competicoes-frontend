import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { provasRoutedComponents, ProvasRoutingModule } from './provas-routing.module';
import { ProvasComponent } from './provas.component';
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
  NbButtonGroupComponent,
  NbButtonGroupModule,
} from '@nebular/theme';
import { ProvasIudComponent } from './provas-iud/provas-iud.component';
import { TempoFormatadoPipe } from '../../shared/pipes/tempo-formatado.pipe';

@NgModule({
  declarations: [
    ...provasRoutedComponents,
    ProvasComponent,
    ProvasIudComponent,
    TempoFormatadoPipe
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

    ProvasRoutingModule
  ]
})

export class ProvasModule { }
