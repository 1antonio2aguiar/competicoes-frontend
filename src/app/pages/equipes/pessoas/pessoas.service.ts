import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Filters } from '../../../shared/filters/filters';
import { environment } from '../../../../environments/environment';
import { Pessoa } from '../../../shared/models/pessoa';

@Injectable({
  providedIn: 'root'
})

export class PessoasService extends BaseResourceService<Pessoa> {

  filtro: Filters = new Filters(); 

  // etapa por id.
  private pessoaEventHendlerId: EventEmitter<Pessoa>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'pessoas', injector, Pessoa.fromJson);
    this.pessoaEventHendlerId = new EventEmitter<Pessoa>();
  }

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiPath + '/filter');
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params

    params = params
      .append('page', filtro.pagina.toString())
      .append('size', filtro.itensPorPagina.toString());

    return this.http
      .get<any>(this.apiPath + '/filter', { params }) // Use the declared params
      .toPromise()
      .then((response) => {
        // Ajuste conforme a estrutura da sua resposta da API
        const pessoas = response.content
        const resultado = {
          pessoas,
          total: response.totalElements
        };
        return resultado;
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        throw error; // Re-lance o erro para ser tratado em outro lugar
      });
  }

}
