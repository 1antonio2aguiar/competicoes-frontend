import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { TiposNadoRoutingModule } from './tipos-nado-routing.module';
import { TiposNadoRoutedComponents } from './tipos-nado-routing.module';


@NgModule({
  declarations: [
    ...TiposNadoRoutedComponents
  ],
  imports: [
    CommonModule,
    TiposNadoRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule
  ]
})

export class TiposNadoModule { }

