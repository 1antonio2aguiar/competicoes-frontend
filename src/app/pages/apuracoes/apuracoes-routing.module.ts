import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApuracoesComponent } from './apuracoes.component';
import { ApuracoesPesquisaComponent } from './apuracoes-pesquisa/apuracoes-pesquisa.component';

const routes: Routes = [{
  path: '',
  component: ApuracoesComponent,
  children: [{
    path: 'apuracoes-pesquisa',
    component: ApuracoesPesquisaComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ApuracoesRoutingModule { }

export const apuracoesRoutedComponents = [
  ApuracoesComponent,
  ApuracoesPesquisaComponent,
];
