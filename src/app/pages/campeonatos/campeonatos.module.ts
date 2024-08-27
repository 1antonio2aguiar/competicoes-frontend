import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { CampeonatosRoutingModule } from './campeonatos-routing.module';
import { campeonatosRoutedComponents } from './campeonatos-routing.module';

import { ModalidadesModule } from '../modalidades/modalidades.module';
import { ModalidadesSelectModule } from '../modalidades/modalidade-select/modalidades-select.module';


@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    CampeonatosRoutingModule,
    Ng2SmartTableModule,
    ModalidadesModule,
    ModalidadesSelectModule
  ],
  declarations: [
    ...campeonatosRoutedComponents
  ],
})

export class CampeonatosModule { }
