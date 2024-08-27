import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NbSelectModule } from '@nebular/theme';

import { ModalidadesComponent } from './modalidades.component';
import { ModalidadePesquisaComponent } from './modalidade-pesquisa/modalidade-pesquisa.component';


const routes: Routes = [{
  path: '',
  component: ModalidadesComponent,
  children: [
	  {
      path: 'modalidade-pesquisa',
      component: ModalidadePesquisaComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ModalidadesRoutingModule { }

export const modalidadesRoutedComponents = [
  ModalidadesComponent,
  ModalidadePesquisaComponent
];

