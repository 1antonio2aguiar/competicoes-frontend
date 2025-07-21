import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscricoesComponent } from './inscricoes.component';
import { InscricoesPesquisaComponent } from './inscricoes-pesquisa/inscricoes-pesquisa.component';

const routes: Routes = [{
  path: '',
  component: InscricoesComponent,
  children: [{
    path: 'inscricoes-pesquisa',
    component: InscricoesPesquisaComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InscricoesRoutingModule { }

export const inscricoesRoutedComponents = [
  InscricoesComponent,
  InscricoesPesquisaComponent,
];