import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiposNadoComponent } from './tipos-nado.component';
import { TiposNadoIudComponent } from './tipos-nado-iud/tipos-nado-iud.component';

const routes: Routes = [{
  path: '',
  component: TiposNadoComponent,
  children: [{
    path: 'tipos-nado-iud',
    component: TiposNadoIudComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TiposNadoRoutingModule { }

export const TiposNadoRoutedComponents = [
  TiposNadoComponent,
  TiposNadoIudComponent,
];

