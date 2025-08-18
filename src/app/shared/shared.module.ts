import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BaseResourceConfirmationComponent } from './components/base-resource-confirmation/base-resource-confirmation.component';

import { ToastModule } from "primeng/toast";
import { LOCALE_ID } from '@angular/core';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';


@NgModule({
  declarations: [
  BreadCrumbComponent,
  PageHeaderComponent,
  FormFieldErrorComponent,
  ServerErrorMessagesComponent,
  BaseResourceConfirmationComponent,
  
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BreadcrumbModule,
    MessagesModule,
    ButtonModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MessagesModule,
    MessageModule,
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    BaseResourceConfirmationComponent,

  ]/*,
  providers:[
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]*/
})
export class SharedModule { }
