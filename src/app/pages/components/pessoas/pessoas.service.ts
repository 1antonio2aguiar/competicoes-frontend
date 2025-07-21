import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Filters } from '../../../shared/filters/filters';
import { environment } from '../../../../environments/environment';
import { Pessoa } from '../../../shared/models/pessoa';

@Injectable({
  providedIn: 'root'
})

export class PessoasService extends BaseResourceService<Pessoa> {

  // pessoa por id.
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

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

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
      }
    );
  }

  // Aqui recupera somente pessoas que não estão em equipes(tabela)
  pessoaNotInEquipes(filtro: Filters): Promise<any> {
    let params = filtro.params

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    return this.http
      .get<any>(this.apiPath + '/pessoaNotInEquipes', { params }) // Use the declared params
      .toPromise()
      .then((response) => {
        // Ajuste conforme a estrutura da sua resposta da API
        const pessoas = response.content
        const resultado = {
          pessoas,
          total: response.totalElements
        };
        console.log('Resultado pessoaNotInEquipes ', resultado)
        return resultado;
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        throw error; // Re-lance o erro para ser tratado em outro lugar
      }
    );
  }
}
