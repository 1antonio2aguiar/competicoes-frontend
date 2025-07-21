import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ModalidadesRoutingModule, modalidadesRoutedComponents } from './modalidades-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    ModalidadesRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule,

    CommonModule,
    ReactiveFormsModule,
    
  ],
  declarations: [
    ...modalidadesRoutedComponents
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Adiciona o CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class ModalidadesModule { }
