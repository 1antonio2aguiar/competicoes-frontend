import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    
    {
      path: 'campeonatos',
      loadChildren: () => import('./campeonatos/campeonatos.module').then(m => m.CampeonatosModule),
    },

    {
      path: 'etapas',
      loadChildren: () => import('./etapas/etapas.module').then(m => m.EtapasModule),
    },

    {
      path: 'locais-competicoes',
      loadChildren: () => import('./locais-competicoes/locais-competicoes.module').then(m => m.LocaisCompeticoesModule),
    },

    {
      path: 'modalidades',
      loadChildren: () => import('./modalidades/modalidades.module').then(m => m.ModalidadesModule),
    },
    

    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    
    
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PagesRoutingModule {
}
