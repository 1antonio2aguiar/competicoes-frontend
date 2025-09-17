// Em src/app/shared/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme'; 
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // 1. Verifica se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      this.showToast('Você precisa fazer login para acessar esta página.', 'danger');
      this.router.navigate(['/auth/login']);
      return false;
    }

    // 2. Se a rota especifica perfis necessários, verifica-os
    // A propriedade 'roles' no data da rota deve ser um array de strings (ex: ['ADMIN', 'GERENTE'])
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.length > 0) {
      const userHasRequiredRole = this.authService.userHasRole(requiredRoles);

      console.log('requiredRoles ', requiredRoles, ' ', userHasRequiredRole)

      if (!userHasRequiredRole) {
        this.showToast('Você não tem permissão para acessar esta página.', 'warning');
        // Redireciona para uma página de "acesso negado" ou para o dashboard
        this.router.navigate(['/pages/dashboard']); // Ou '/pages/access-denied' se tiver uma
        return false;
      }
    }

    // Se passou por todas as verificações, o acesso é permitido
    return true;
  }

  // Método auxiliar para exibir toasts
  private showToast(message: string, status: string) {
    this.toastrService.show(message, '', { status, duration: 3000, preventDuplicates: true });
  }
}