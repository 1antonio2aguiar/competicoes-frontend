import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvasPesquisaComponent } from './provas-pesquisa/provas-pesquisa.component';
import { ProvasComponent } from './provas.component';

const routes: Routes = [{
  path: '',
  component: ProvasComponent,
  children: [{
    path: 'provas-pesquisa',
    component: ProvasPesquisaComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProvasRoutingModule { }

export const provasRoutedComponents = [
  ProvasComponent,
  ProvasPesquisaComponent,
];
