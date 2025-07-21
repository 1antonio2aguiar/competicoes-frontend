import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  NbButtonGroupModule,
} from '@nebular/theme';

//import { PessoasComponent } from './pessoas/pessoas-busca/pessoas.component';
import { PorNomeComponent } from './pessoas/componentes-busca/por-nome/por-nome.component';
import { PorCpfComponent } from './pessoas/componentes-busca/por-cpf/por-cpf.component';
import { PorDataNascimentoComponent } from './pessoas/componentes-busca/por-data-nascimento/por-data-nascimento.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete-modal.component';

@NgModule({
  declarations: [
    //PessoasComponent,
    PorNomeComponent,
    PorDataNascimentoComponent,
    PorCpfComponent,
    ConfirmDeleteComponent
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

    FormsRoutingModule,
    ngFormsModule
  ]
})

export class EquipesModule { }

