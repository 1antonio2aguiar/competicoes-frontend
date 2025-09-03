/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';

import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Importe HTTP_INTERCEPTORS
import { TokenInterceptor } from './shared/interceptors/token.interceptor'; // Importe seu interceptor

import { 
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { LoginComponent } from './auth/login.component';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [ 
    AppComponent, 
  ],


  imports: [ 
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),

    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    HttpClientModule,
    AuthModule,


    // Módulo de Segurança do Nebular
    NbSecurityModule.forRoot({
      accessControl: {
        guest: {
          view: '*',
        },
        user: { // Exemplo de um papel 'user'
          parent: 'guest',
          create: '*',
          edit: '*',
          remove: '*',
        },
        admin: { // Exemplo de um papel 'admin'
          parent: 'user',
          // Admins podem fazer tudo que 'user' faz, e mais
        },
      },
    }),

    // Módulo de Autenticação do Nebular
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email', // Nome da estratégia, pode ser qualquer um
          
          baseEndpoint: 'http://localhost:8080', // << MUDE AQUI para o endereço do seu backend
          
          login: {
            endpoint: '/auth/login', // << MUDE AQUI para o endpoint de login do seu backend
            method: 'post',
            redirect: {
              success: '/pages/dashboard', // Para onde ir após login com sucesso
              failure: null, // Fica na tela de login em caso de falha
            },
          },
          
          token: {
            class: NbAuthJWTToken,
            key: 'token', // A chave no JSON de resposta que contém o token. Ex: { "token": "..." }
          }
        }),
      ],
      
      forms: {}, // Usa a configuração padrão de formulários
    }),
    
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent],
})
export class AppModule {
}
