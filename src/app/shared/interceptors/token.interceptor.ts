import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importe seu AuthService

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Pega o token usando o serviço que já criamos
    const token = this.authService.getToken();

    // 2. Verifica se o token existe
    if (token) {
      // 3. Se o token existe, clona a requisição original e adiciona o cabeçalho de autorização
      const clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      
      // 4. Envia a requisição CLONADA (com o token) para o backend
      return next.handle(clonedRequest);
    }

    // 5. Se não houver token, apenas deixa a requisição original seguir seu caminho
    //    (útil para as rotas de login e cadastro, que não precisam de token)
    return next.handle(request);
  }
}