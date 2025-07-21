import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbSidebarModule, } from '@nebular/theme';

import { PessoaApiRoutedComponents, PessoaApiRoutingModule } from './pessoa-api-routing.module';
import { Cep } from '../../shared/pipes/cep.pipe';
import { TelefonePipe } from '../../shared/pipes/telefone.pipe';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsRoutingModule } from '../forms/forms-routing.module';

import { NbMomentDateModule } from '@nebular/moment'; // Apenas o módulo

import { 
  NbAutocompleteModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, 
  NbIconModule,
  NbInputModule,
  NbLayoutModule,         // <--- ADICIONE ESTE
  NbMenuModule,           // <--- ADICIONE ESTE (para o <nb-menu>)
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTreeGridModule,       // Você já tem este (não usado no exemplo do formulário, mas está aí)
  NbUserModule,
  NbButtonGroupModule, 
  NbDialogModule ,
  NbThemeModule
} from '@nebular/theme';

import { MyDatepickerCustonComponent } from '../components/date-picker/my-datepicker-custon.component';
import { EnderecoIudComponent } from './endereco/endereco-iud/endereco-iud.component';

@NgModule({
  declarations: [
    ...PessoaApiRoutedComponents, MyDatepickerCustonComponent, EnderecoIudComponent, Cep, TelefonePipe
  ],

    imports: [
    CommonModule,

    FormsModule,
    ThemeModule,
    
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
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
    NbSidebarModule,
    FormsRoutingModule,

    NbDialogModule.forChild(),

    NbMomentDateModule,
   
    NbSpinnerModule,

    NbLayoutModule,      
    NbMenuModule,
    NbAutocompleteModule,

    PessoaApiRoutingModule
  ],

})

export class PessoaApiModule { }
