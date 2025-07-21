import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipesPesquisaComponent } from './equipes-pesquisa/equipes-pesquisa.component';
import { EquipesComponent } from './equipes.component';

const routes: Routes = [
  {
    path: '',
    component: EquipesComponent,
    children: [{
      path: 'equipes-pesquisa',
      component: EquipesPesquisaComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EquipesRoutingModule { }

export const equipesRoutedComponents = [
  EquipesComponent,
  EquipesPesquisaComponent
];
