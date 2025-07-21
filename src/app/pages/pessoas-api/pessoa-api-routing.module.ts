import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PessoaApiComponent } from './pessoa-api.component';
import { PessoaApiPesquisaComponent } from './pessoa-api-pesquisa/pessoa-api-pesquisa.component';
import { PessoaApiIudComponent } from './pessoa-api-iud/pessoa-api-iud.component';
import { EnderecoPesquisaComponent } from './endereco/endereco-pesquisa/endereco-pesquisa.component';
import { PessoaPerfilFormComponent } from './pessoa-api-iud/pessoa-perfil-form.component';
import { ContatoPesquisaComponent } from './contato/contato-pesquisa/contato-pesquisa.component';
import { ContatoIudComponent } from './contato/contato-iud/contato-iud.component';
import { DocumentoPesquisaComponent } from './documento/documento-pesquisa/documento-pesquisa.component';
import { DocumentoIudComponent } from './documento/documento-iud/documento-iud.component';

const routes: Routes = [{
  path: '',
  component: PessoaApiComponent, // Componente pai com <router-outlet> de primeiro nível
  children: [
    { path: '', redirectTo: 'pessoa-api-pesquisa', pathMatch: 'full' },
    {
      path: 'pessoa-api-pesquisa',
      component: PessoaApiPesquisaComponent,
    },

    /*{
      path: 'cadastrar',
      component: PessoaApiIudComponent,
    },*/


    {
      path: 'cadastrar', // Para criar uma nova pessoa (carrega o container)
      component: PessoaApiIudComponent,
      children: [
        { path: '', redirectTo: 'perfil', pathMatch: 'full' },
        { path: 'perfil', component: PessoaPerfilFormComponent },
        { path: 'enderecos', component: EnderecoPesquisaComponent }, 
        { path: 'contatos', component: ContatoPesquisaComponent },
        // { path: 'documentos', component: SeuDocumentosComponent },
      ]
    },
    {
      path: 'editar/:id', // Para editar uma pessoa existente (carrega o mesmo container)
      component: PessoaApiIudComponent,
      children: [
        { path: '', redirectTo: 'perfil', pathMatch: 'full' },
        { path: 'perfil', component: PessoaPerfilFormComponent },
        { path: 'enderecos', component: EnderecoPesquisaComponent }, 
        { path: 'contatos', component: ContatoPesquisaComponent }, 
        { path: 'documentos', component: DocumentoPesquisaComponent }, 
      ]
    },

    
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaApiRoutingModule { }

export const PessoaApiRoutedComponents = [
  PessoaApiComponent,
  PessoaApiPesquisaComponent,
  PessoaApiIudComponent, // Container
  PessoaPerfilFormComponent, // Formulário de perfil
  EnderecoPesquisaComponent,
  ContatoPesquisaComponent,
  ContatoIudComponent,
  DocumentoPesquisaComponent,
  DocumentoIudComponent
];