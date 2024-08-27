//import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { locaisCompeticoesRoutedComponents, LocaisCompeticoesRoutingModule } from './locais-competicoes-routing.module';


@NgModule({
  imports: [
    //CommonModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    LocaisCompeticoesRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule,
  ],
  declarations: [
    ...locaisCompeticoesRoutedComponents
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Adiciona o CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class LocaisCompeticoesModule { }
