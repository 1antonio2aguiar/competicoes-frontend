import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { empresasRoutedComponents, EmpresasRoutingModule } from './empresas-routing.module';


@NgModule({
  declarations: [
    ...empresasRoutedComponents
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
    EmpresasRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Adiciona o CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class EmpresasModule { }

