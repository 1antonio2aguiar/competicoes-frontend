// Em src/app/shared/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode"; // << INSTALE ESTA BIBLIOTECA

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private router: Router) { }

  /**
   * Salva o token de autenticação no localStorage.
   * O próprio Nebular já faz isso, mas este método é útil para controle manual.
   */
  public saveToken(token: string): void {
    localStorage.setItem('auth_app_token', token);
  }

  /**
   * Pega o token do localStorage.
   */
  // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  /*public getToken(): string | null {
    // O Nebular salva o token com uma chave específica. Verifique no seu localStorage qual é.
    // Geralmente é algo como 'auth_app_token' ou um nome que você configurou.
    // Para este exemplo, vamos usar a chave do Nebular.
    const authData = localStorage.getItem('auth_app_token');
    if (authData) {
      const tokenObject = JSON.parse(authData);
      return tokenObject.value; // O token JWT fica dentro de 'value'
    }
    return null;
  }*/

  public getToken(): string | null {
    const stored = localStorage.getItem('auth_app_token');
    if (!stored) return null;

    try {
      // O Nebular SEMPRE salva como JSON string
      const obj = JSON.parse(stored);

      // O token JWT fica no campo "value" do objeto
      if (obj && obj.value) {
        return obj.value;
      }

      return null;
    } catch (e) {
      console.error('Erro ao parsear token do Nebular:', e);
      return null;
    }
  }


  /**
   * Verifica se o usuário está autenticado (se existe um token válido).
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Você pode adicionar uma lógica para verificar se o token expirou aqui
    return token !== null;
  }

  /**
   * Decodifica o token JWT para extrair informações como roles (perfis).
   */
  private getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
      }
    }
    return null;
  } 

  /**
   * A FUNÇÃO QUE VOCÊ PRECISA: Verifica se o usuário tem um determinado perfil.
   * @param requiredRole O perfil necessário (ex: 'ADMIN', 'OPERADOR').
   */
  public userHasRole(requiredRole: string | string[]): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }

    // IMPORTANTE: O nome do campo que contém os perfis no seu token
    // depende do seu backend. Pode ser 'roles', 'authorities', 'scope', etc.
    // Verifique o payload do seu token JWT!
    const userRoles: string[] = decodedToken.perfis;

    if (typeof requiredRole === 'string') {
      return userRoles.includes(requiredRole);
    } else { // Se for um array de perfis
      return requiredRole.some(role => userRoles.includes(role));
    }
  } 

  /**
   * Faz o logout do usuário.
   */
  public logout(): void {
    localStorage.removeItem('auth_app_token');
    this.router.navigate(['/auth/login']);
  }

  public getEmpresaId(): number | null {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.empresaId) {
      return decodedToken.empresaId;
    }
    return null;
  }

  getCompanyName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.razaoSocial : null;
  }

  public getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    // O backend precisa adicionar o nome do usuário como uma "claim" no token.
    // Pode ser 'name', 'nome', 'sub', etc. Verifique seu TokenService.java.
    // Para este exemplo, vamos assumir que o backend envia o campo 'sub' com o email.
    if (decodedToken && decodedToken.sub) {
      return decodedToken.sub; // Por enquanto, vamos usar o email
    }
    return null;
  }
}