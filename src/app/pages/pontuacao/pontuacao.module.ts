import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { PontuacaoRoutedComponents } from './pontuacao-routing.module';
import { PontuacaoRoutingModule } from './pontuacao-routing.module';


@NgModule({
  declarations: [
    ...PontuacaoRoutedComponents
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    PontuacaoRoutingModule,
    Ng2SmartTableModule
  ]
})

export class PontuacaoModule { }
