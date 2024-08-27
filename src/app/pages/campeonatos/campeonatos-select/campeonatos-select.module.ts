import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../../../@theme/theme.module';
import { CampeonatoSelectComponent } from './campeonatosSelectComponent';

@NgModule({
  declarations: [CampeonatoSelectComponent],
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbSelectModule,
  ],
  exports:[CampeonatoSelectComponent]
})

export class CampeonatosSelectModule { }
