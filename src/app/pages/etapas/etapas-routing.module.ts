import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtapasComponent } from './etapas.component';
import { EtapasIudComponent } from './etapas-iud/etapas-iud.component';
import { DataEditorComponent } from './data-editor/data-editor.component';
import { DataEditorRenderComponent } from './data-editor/data-editor.component';
import { DatepickerComponent } from '../forms/datepicker/datepicker.component';

const routes: Routes = [
  {
    path: '',
    component: EtapasComponent,
    children: [{
      path: 'etapas-iud',
      component: EtapasIudComponent
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
  EtapasIudComponent,
  DataEditorComponent,
  DataEditorRenderComponent,

  DatepickerComponent
];
