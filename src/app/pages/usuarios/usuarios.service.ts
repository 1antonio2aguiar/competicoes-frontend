import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Filters } from '../../shared/filters/filters';

import { Usuario } from '../../shared/models/usuario';
import { Empresa } from '../../shared/models/empresa';
import { Perfil } from '../../shared/models/perfil';

@Injectable({
  providedIn: 'root'
})

export class UsuariosService extends BaseResourceService<Usuario>{

  private usuarioEventHendlerId: EventEmitter<Usuario>;
    constructor(protected injector: Injector) {
      super(environment.apiUrl + 'usuarios', injector, Usuario.fromJson);
      this.usuarioEventHendlerId = new EventEmitter<Usuario>;
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    // Supondo que o backend agora retorna a empresa e os perfis
    return this.http
      .get<any>(this.apiPath +'/filter', { params })
      .toPromise()
      .then((response) => {
        const usuarios = response.content.map(Usuario.fromJson); // Mapear para o modelo Usuario
        const resultado = {
          usuarios,
        };
        console.log('Resultado: ', resultado.usuarios)
        return resultado;
      }
    );
  }

  /*pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    return this.http
      .get<any>(this.apiPath +'/filter', { params })
      .toPromise()
      .then((response) => {
        const usuarios = response.content;
        const resultado = {
          usuarios,
        };
        console.log('Resultado: ', resultado.usuarios)
        return resultado;
      }
    );
  }*/

  getUsuarioById(usuarioId): Promise<Usuario> {
    return this.http.get<Usuario>(this.apiPath + '/' + usuarioId)
      .toPromise();
  }

  create(usuario: Usuario): Observable<Usuario> {
    // O backend precisará de um DTO que aceite empresaId e perfisIds
    // Ou você pode construir o objeto de envio aqui
    const usuarioToSend = {
      ...usuario,
      empresaId: usuario.empresaId, // Adicionar o ID da empresa
      perfisIds: usuario.perfisIds // Adicionar os IDs dos perfis
    };

    return from(this.http
      .post<Usuario>(this.apiPath, usuarioToSend)
      .toPromise()
      .then(response => {
        return Usuario.fromJson(response);
    }));
  }
    
  update(usuario: Usuario): Observable<Usuario> {
    // O backend precisará de um DTO que aceite empresaId e perfisIds
    const usuarioToSend = {
      ...usuario,
      empresaId: usuario.empresaId, // Adicionar o ID da empresa
      perfisIds: usuario.perfisIds // Adicionar os IDs dos perfis
    };

    return from(this.http
      .put<Usuario>(`${this.apiPath}/${usuario.id}`, usuarioToSend)
      .toPromise()
      .then(response => {
        return Usuario.fromJson(response);
    }));
  }
    
  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Modalidade deletada com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }

  getEmpresas(): Promise<Empresa[]> {
    return this.http.get<Empresa[]>(environment.apiUrl + 'empresas')
    .pipe(
      map(empresasData => empresasData.map(Empresa.fromJson))
    )
    .toPromise(); // Agora o toPromise() infere corretamente o tipo após o map
  }

  getPerfis(): Promise<Perfil[]> {
    return this.http.get<Perfil[]>(environment.apiUrl + 'perfis/list')
      .pipe(
        map(perfisData => perfisData.map(Perfil.fromJson))
      )
      .toPromise(); // Agora o toPromise() infere corretamente o tipo após o map
  }
} 