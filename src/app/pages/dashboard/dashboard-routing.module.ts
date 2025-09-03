import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardShowComponent } from "./show/dashboard-show.component";
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '',
  component: DashboardShowComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }

export const dashboardRoutedComponents = [
  DashboardComponent,
  DashboardShowComponent,
];
