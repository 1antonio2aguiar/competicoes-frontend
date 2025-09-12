import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Filters } from '../../shared/filters/filters';
import { Perfil } from '../../shared/models/perfil';

@Injectable({
  providedIn: 'root'
})

export class PerfisService extends BaseResourceService<Perfil>{
  private perfilEventHendlerId: EventEmitter<Perfil>;
  
    constructor(protected injector: Injector) {
      super(environment.apiUrl + 'perfis', injector, Perfil.fromJson);
      this.perfilEventHendlerId = new EventEmitter<Perfil>;
  }

  pesquisar(filtro: Filters): Promise<any> {
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
        const perfis = response.content;
        const resultado = {
          perfis,
        };
        console.log('Resultado: ', resultado.perfis)
        return resultado;
      }
    );
  }

  listAll(): Promise<Perfil[]> {
    //console.log('Chegou no service! ',this.apiPath + '/list' )
    return this.http
      .get<Perfil[]>(this.apiPath + '/list')
      .toPromise();
  }

  create(perfil: Perfil): Observable<Perfil> {
    return from(this.http
      .post<Perfil>(this.apiPath, perfil)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Modalidade criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(perfil: Perfil): Observable<Perfil> {
    return from(this.http
      .put<Perfil>(`${this.apiPath}/${perfil.id}`, perfil)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Modalidade atualizada com sucesso:', response);
        return response;
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
}
