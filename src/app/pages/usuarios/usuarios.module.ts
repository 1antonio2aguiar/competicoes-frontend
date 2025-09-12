import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
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
  NbButtonGroupModule,
} from '@nebular/theme';

import { usuariosRoutedComponents, UsuariosRoutingModule } from './usuarios-routing.module';

@NgModule({
  declarations: [
    ...usuariosRoutedComponents,
    
  ],
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbSelectModule,

    CommonModule,
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
    NbThemeModule,
    FormsRoutingModule,
    ngFormsModule,


    UsuariosRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Adiciona o CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class UsuariosModule { }
 