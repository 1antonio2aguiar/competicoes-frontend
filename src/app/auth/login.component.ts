import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {
  // Não precisa adicionar nada aqui. Toda a lógica (método login(), user, errors)
  // já é herdada da classe NbLoginComponent.
}