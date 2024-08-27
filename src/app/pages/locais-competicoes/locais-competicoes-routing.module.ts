import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocaisCompeticoesComponent } from './locais-competicoes.component';
import { LocaisCompeticoesIudComponent } from './locais-competicoes-iud/locais-competicoes-iud.component';


const routes: Routes = [{
    path: '',
    component: LocaisCompeticoesIudComponent,
    children: [
        {
        path: 'locais-competicoes-iud',
        component: LocaisCompeticoesComponent,
      },
    ],
  }];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  
  export class LocaisCompeticoesRoutingModule { }
  
  export const locaisCompeticoesRoutedComponents = [
    LocaisCompeticoesIudComponent,
    LocaisCompeticoesComponent
  ];
  