import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { CategoriasIudComponent } from './categorias-iud/categorias-iud.component';

const routes: Routes = [{
  path: '',
  component: CategoriasComponent,
  children: [{
    path: 'categorias-uid',
    component: CategoriasIudComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CategoriasRoutingModule { }

export const categoriasRoutedComponents = [
  CategoriasComponent,
  CategoriasIudComponent,
];
