import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtapasComponent } from './etapas.component';
import { DataEditorComponent } from './data-editor/data-editor.component';
import { DataEditorRenderComponent } from './data-editor/data-editor.component';
import { DatepickerComponent } from '../forms/datepicker/datepicker.component';
import { EtapasPesquisaComponent } from './etapas-pesquisa/etapas-pesquisa.component';
import { ConfirmationDialogComponent } from '../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: EtapasComponent,
    children: [{
      path: 'etapas-pesquisa',
      component: EtapasPesquisaComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EtapasRoutingModule { }

export const etapasRoutedComponents = [
  EtapasComponent,
  EtapasPesquisaComponent,
  DataEditorComponent,
  DataEditorRenderComponent,
  ConfirmationDialogComponent,

  DatepickerComponent
];
