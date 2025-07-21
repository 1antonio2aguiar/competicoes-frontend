import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Pontuacao } from '../../shared/models/pontuacao';

@Injectable({
  providedIn: 'root'
})

export class PontuacaoService extends BaseResourceService<Pontuacao>{

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'pontuacao', injector, Pontuacao.fromJson);
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
        const pontuacao = response.content;
        const resultado = {
          pontuacao,
          total: response.totalElements,
        };
        //console.log('Resultado: ', resultado.pontuacao)
        return resultado;
    });
  }
  
  create(pontuacao: Pontuacao): Observable<Pontuacao> {
    return from(this.http
      .post<Pontuacao>(this.apiPath, pontuacao)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Pontuacao criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(pontuacao: Pontuacao): Observable<Pontuacao> {
    return from(this.http
      .put<Pontuacao>(`${this.apiPath}/${pontuacao.id}`, pontuacao)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Pontuacao atualizado com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('tPontuacao deletado com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
}
