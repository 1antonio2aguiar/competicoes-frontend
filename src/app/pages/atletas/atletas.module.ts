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

import { atletasRoutedComponents, AtletasRoutingModule } from './atletas-routing.module';
import { AtletasIudComponent } from './atletas-iud/atletas-iud.component';
import { PessoasComponent } from '../components/pessoas/pessoas-busca/pessoas.component';
import { PorCpfComponent } from '../components/pessoas/componentes-busca/por-cpf/por-cpf.component';
import { PorDataNascimentoComponent } from '../components/pessoas/componentes-busca/por-data-nascimento/por-data-nascimento.component';
import { ConfirmDeleteComponent } from '../components/confirm-delete/confirm-delete-modal.component';
import { EquipesBuscaComponent } from '../components/equipes/equipes-busca/equipes-busca.component';
import { EquipesPorNomeComponent } from '../components/equipes/equipes-por-nome/equipes-por-nome.component';

@NgModule({
  declarations: [
    ...atletasRoutedComponents,
    AtletasIudComponent,

    PessoasComponent,
    PorCpfComponent,
    PorDataNascimentoComponent,
    ConfirmDeleteComponent,

    EquipesBuscaComponent,
    EquipesPorNomeComponent,
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
    ngFormsModule,
    
    AtletasRoutingModule
  ]
})

export class AtletasModule { }
