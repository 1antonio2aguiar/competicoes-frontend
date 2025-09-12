import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuard } from '../shared/guards/auth.guard'; // << IMPORTE O GUARD

import { DashboardShowComponent } from './dashboard/show/dashboard-show.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [AuthGuard], // <<< APLIQUE O GUARD AQUI
  children: [

    {
      path: 'dashboard',
      component: DashboardShowComponent,
    },
    
    // ROTA PADRÃO - Se o usuário acessar /pages, redireciona para o dashboard
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },

    {
      path:  'atletas',
      loadChildren: () => import('./atletas/atletas.module').then(m => m.AtletasModule),
    },
    
    {
      path: 'campeonatos',
      loadChildren: () => import('./campeonatos/campeonatos.module').then(m => m.CampeonatosModule),
    },

    {
      path: 'categorias', 
      loadChildren: () => import('./categorias/categorias.module').then(m => m.CategoriasModule),
    },

    {
      path: 'modalidades',
      loadChildren: () => import('./modalidades/modalidades.module').then(m => m.ModalidadesModule),
    },

    {
      path: 'empresas',
      loadChildren: () => import('./empresas/empresas.module').then(m => m.EmpresasModule),
    },

    {
      path: 'perfis',
      loadChildren: () => import('./perfis/perfis.module').then(m => m.PerfisModule),
    },

    {
      path: 'usuarios',
      loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
    },

    {
      path: 'apuracoes',
      loadChildren: () => import('./apuracoes/apuracoes.module').then(m => m.ApuracoesModule),
    },

    {
      path: 'equipes',
      loadChildren: () => import('./equipes/equipes.module').then(m => m.EquipesModule),
    },

    {
      path: 'etapas',
      loadChildren: () => import('./etapas/etapas.module').then(m => m.EtapasModule),
    },

    {
      path: 'inscricoes',
      loadChildren: () => import('./inscricoes/inscricoes.module').then(m => m.InscricoesModule),
    },

    {
      path: 'locais-competicoes',
      loadChildren: () => import('./locais-competicoes/locais-competicoes.module').then(m => m.LocaisCompeticoesModule),
    },

   

    {
      path: 'pessoas-api',
      loadChildren: () => import('./pessoas-api/pessoa-api.module').then(m => m.PessoaApiModule),
    },

    {
      path: 'pontuacao',
      loadChildren: () => import('./pontuacao/pontuacao.module').then(m => m.PontuacaoModule),
    },


    {
      path: 'provas',
      loadChildren: () => import('./provas/provas.module').then(m => m.ProvasModule),
    },
    
    {
      path: 'tipos-nado',
      loadChildren: () => import('./tipos-nado/tipos-nado.module').then(m => m.TiposNadoModule),
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
