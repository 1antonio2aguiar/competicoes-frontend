import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampeonatosComponent } from './campeonatos.component';
import { CampeonatosPesquisaComponent } from './campeonatos-pesquisa/campeonatos-pesquisa.component';

const routes: Routes = [{
  path: '',
  component: CampeonatosComponent,
  children: [{
    path: 'campeonato-pesquisa',
    component: CampeonatosPesquisaComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CampeonatosRoutingModule { }

export const campeonatosRoutedComponents = [
  CampeonatosComponent,
  CampeonatosPesquisaComponent,
];
