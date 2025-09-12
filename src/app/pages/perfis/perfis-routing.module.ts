import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PerfisComponent } from './perfis.component';
import { PerfisIudComponent } from './perfis-iud/perfis-iud.component';

const routes: Routes = [{
  path: '',
  component: PerfisComponent,
  children: [
    {
      path: 'perfis-iud',
      component: PerfisIudComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PerfisRoutingModule { }

export const perfisRoutedComponents = [
  PerfisComponent,
  PerfisIudComponent
];
