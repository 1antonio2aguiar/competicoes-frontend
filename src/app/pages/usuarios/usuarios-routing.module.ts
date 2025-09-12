import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuariosIudComponent } from './usuarios-iud/usuarios-iud.component';

const routes: Routes = [{
  path: '',
  component: UsuariosComponent,
  children: [
    {
      path: 'usuarios-pesquisa',
      component: UsuariosPesquisaComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsuariosRoutingModule { }

export const usuariosRoutedComponents = [
  UsuariosComponent,
  UsuariosPesquisaComponent,
  UsuariosIudComponent
];
