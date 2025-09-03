import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // << IMPORTANTE PARA O ngModel
import { RouterModule } from '@angular/router';

// IMPORTS DO NEBULAR NECESSÁRIOS PARA O FORMULÁRIO
import { NbAlertModule, NbInputModule, NbButtonModule, NbCheckboxModule } from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [
    LoginComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,     
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule,
  ]
})
export class AuthModule { }