import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NbMomentDateModule } from '@nebular/moment';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { categoriasRoutedComponents } from './categorias-routing.module';

import { ReactiveFormsModule } from '@angular/forms';

import {
  NbThemeModule,
  NbLayoutModule,
  NbDatepickerModule,
 } from '@nebular/theme';
import { DatepickerComponent } from './date-picker/datepicker.component';


@NgModule({
  declarations: [
    ...categoriasRoutedComponents,
    DatepickerComponent
  ],

  imports: [
    
    CommonModule,
    CategoriasRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NbLayoutModule,
    NbDatepickerModule.forRoot(),
    NbThemeModule,
    NbMomentDateModule, OwlDateTimeModule, OwlNativeDateTimeModule, ReactiveFormsModule
  ]
})

export class CategoriasModule { }
