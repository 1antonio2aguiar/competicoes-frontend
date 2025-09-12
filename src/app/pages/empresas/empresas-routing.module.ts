import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresasComponent } from './empresas.component';
import { EmpresasIudComponent } from './empresas-iud/empresas-iud.component';

const routes: Routes = [{
  path: '',
  component: EmpresasComponent,
  children: [
    {
      path: 'empresas-iud',
      component: EmpresasIudComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmpresasRoutingModule { }

export const empresasRoutedComponents = [
  EmpresasComponent,
  EmpresasIudComponent
];
