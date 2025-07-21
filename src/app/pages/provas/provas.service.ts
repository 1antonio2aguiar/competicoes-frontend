import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';

import { Prova } from '../../shared/models/prova';

@Injectable({
  providedIn: 'root'
})

export class ProvasService extends BaseResourceService<Prova>{

  // prova por id.
  private provaEventHendlerId: EventEmitter<Prova>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'prova', injector, Prova.fromJson);
    this.provaEventHendlerId = new EventEmitter<Prova>();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;
    
    return this.http
      .get<any>(this.apiPath +'/filter', { params })
      .toPromise()
      .then((response) => {
        const provas = response.content;
        const resultado = {
          provas,
          total: response.totalElements,
        };
        console.table('Resultado: ', provas)
        return resultado;
    });
  }

  listAll(): Promise<Prova[]> {
    return this.http
      .get<Prova[]>(this.apiPath)
      .toPromise();
  }

  getProvaById(provaId): Promise<Prova> {
    return this.http.get<Prova>(this.apiPath + '/' + provaId)
      .toPromise();
  }

  create(prova: Prova): Observable<Prova> {
    prova.empresaId = 1;

    //console.log('ta no create ', prova)
    return from(this.http
      .post<Prova>(this.apiPath, prova)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('prova criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(prova: Prova): Observable<Prova> {

    prova.empresaId = 1;

    return from(this.http
      .put<Prova>(`${this.apiPath}/${prova.id}`, prova)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //.log('prova atualizada com sucesso:', response);
        return response;
    }));
  }
    
  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('prova deletado com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
}
