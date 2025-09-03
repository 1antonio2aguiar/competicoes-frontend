import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service'; // << Importe seu AuthService

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard-show.component.html',
  styleUrls: ['./dashboard-show.component.scss']
})

export class DashboardShowComponent implements OnInit {

  nomeUsuario: string = 'Usuário'; // Valor padrão

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Pega o nome do usuário do token JWT para uma saudação personalizada
    const nome = this.authService.getUserName(); 
    if (nome) {
      this.nomeUsuario = nome;
    }
  }

}