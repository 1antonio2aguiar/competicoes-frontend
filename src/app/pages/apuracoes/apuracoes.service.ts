import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Apuracao } from '../../shared/models/apuracao';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Filters } from '../../shared/filters/filters';

@Injectable({
  providedIn: 'root'
})

export class ApuracoesService extends BaseResourceService<Apuracao>{
  // prova por id.
    private provaEventHendlerId: EventEmitter<Apuracao>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'apuracao', injector, Apuracao.fromJson);
    this.provaEventHendlerId = new EventEmitter<Apuracao>();
  }

  getApuracaoById(apuracaoId): Promise<Apuracao> { 
    return this.http.get<Apuracao>(this.apiPath + '/' + apuracaoId)
    .toPromise();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath + '/filter', { params })
      .toPromise()
      .then((response) => {
        const apuracoes = response.content;
        const resultado = {
          apuracoes,
          total: response.totalElements,
        };
        //console.table('Resultado: ', apuracoes)
        return resultado;
    });
  }

  apuracaoAndInscricao(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath + '/apuracaoAndInscricao', { params })
      .toPromise()
      .then((response) => {
        const apuracoes = response.content;
        const resultado = {
          apuracoes,
          total: response.totalElements,
        };
        console.table('Resultado: ', apuracoes)
        return resultado;
    });
  }

  create(apuracao: Apuracao): Observable<Apuracao> {
    apuracao.empresaId = 1;

    return from(this.http
      .post<Apuracao>(this.apiPath, apuracao)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('apuracao criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
      }
    ));
  }

  updateResultado(apuracao: Apuracao): Observable<Apuracao> {
    apuracao.empresaId = 1;

    return from(this.http
      .put<Apuracao>(`${this.apiPath}/${apuracao.id}`, apuracao)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //.log('prova atualizada com sucesso:', response);
        return response;
      }));
  }

}
