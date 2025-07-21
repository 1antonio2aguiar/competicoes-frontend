import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PontuacaoComponent } from './pontuacao.component';
import { PontuacaoIudComponent } from './pontuacao-iud/pontuacao-iud.component';

const routes: Routes = [{
  path: '',
  component: PontuacaoComponent,
  children: [{
    path: 'pontuacao-iud',
    component: PontuacaoIudComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PontuacaoRoutingModule { }

export const PontuacaoRoutedComponents = [
  PontuacaoComponent,
  PontuacaoIudComponent,
];
