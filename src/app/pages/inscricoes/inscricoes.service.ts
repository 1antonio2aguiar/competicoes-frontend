import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Inscricao } from '../../shared/models/inscricao';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Filters } from '../../shared/filters/filters';

@Injectable({
  providedIn: 'root'
}) 

export class InscricoesService extends BaseResourceService<Inscricao>{
  // prova por id.
  private provaEventHendlerId: EventEmitter<Inscricao>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'inscricao', injector, Inscricao.fromJson);
    this.provaEventHendlerId = new EventEmitter<Inscricao>();
  }

  getInscricaoById(inscricaoId): Promise<Inscricao> { 
    return this.http.get<Inscricao>(this.apiPath + '/' + inscricaoId)
    .toPromise();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath + '/filter', { params })
      .toPromise()
      .then((response) => {
        const inscricoes = response.content;
        const resultado = {
          inscricoes,
          total: response.totalElements,
        };
        //console.table('Resultado Inscricoes: ', inscricoes)
        return resultado;
    });
  }

  create(inscricao: Inscricao): Observable<Inscricao> {

    return from(this.http
      .post<Inscricao>(this.apiPath, inscricao)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('inscricao criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(inscricao: Inscricao): Observable<Inscricao> {

    return from(this.http
      .put<Inscricao>(`${this.apiPath}/${inscricao.id}`, inscricao)
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
        console.log('inscricao deletada com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
  
}
