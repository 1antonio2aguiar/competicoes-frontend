import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtletasPesquisaComponent } from './atletas-pesquisa/atletas-pesquisa.component';
import { AtletasComponent } from './atletas.component';

const routes: Routes = [{
  path: '',
  component: AtletasComponent,
  children: [{
    path: 'atletas-pesquisa',
    component: AtletasPesquisaComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AtletasRoutingModule { }

export const atletasRoutedComponents = [
  AtletasComponent,
  AtletasPesquisaComponent,
];