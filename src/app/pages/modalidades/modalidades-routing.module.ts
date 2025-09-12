import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalidadesComponent } from './modalidades.component';
import { ModalidadesIudComponent } from './modalidade-iud/modalidade-iud.component';

const routes: Routes = [{
  path: '',
  component: ModalidadesComponent,
  children: [
	  {
      path: 'modalidade-iud',
      component: ModalidadesIudComponent,
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
  ModalidadesIudComponent
];

