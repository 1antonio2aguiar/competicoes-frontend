import { Injectable, Injector, EventEmitter } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';
import { PessoaApiOut } from '../../shared/models/pessoaApiOut';
import { PessoaApiIn } from '../../shared/models/pessoaApiIn';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PessoaApiService extends BaseResourceService<PessoaApiOut>{
  // pessoa por id.
  private pessoaEventHendlerId: EventEmitter<PessoaApiOut>

  constructor(protected injector: Injector) {
    super(environment.pessoasApiUrl + 'pessoaFisica', injector, PessoaApiOut.fromJson);
    this.pessoaEventHendlerId = new EventEmitter<PessoaApiOut>();
  } 

  getPessoaById(pessoaId): Promise<PessoaApiOut> { 
        return this.http.get<PessoaApiOut>(this.apiPath + '/' + pessoaId)
          .toPromise();
  }

  listar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath , { params })
      .toPromise()
      .then((response) => {
        const pessoa = response.content;
        const resultado = {
          pessoa,
          total: response.totalElements,
        };
        console.table('Resultado: ', pessoa)
        return resultado;
    });
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath + '/filter?', { params })
      .toPromise()
      .then((response) => {
        const pessoa = response.content;
        const resultado = {
          pessoa,
          total: response.totalElements,
        };
        console.table('Resultado: ', pessoa)
        return resultado;
    });
  }

  create(pessoaApi: PessoaApiIn): Observable<PessoaApiIn> {
    return from(this.http
      .post<PessoaApiOut>(this.apiPath, pessoaApi)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Pessoa criada com sucesso:', response);
        return response; // Retorna a resposta para o Observable
      }));
  }

  update(pessoaApi: PessoaApiIn): Observable<PessoaApiIn> { 
      return from(this.http
        .put<PessoaApiOut>(`${this.apiPath}/${pessoaApi.id}`, pessoaApi)
        .toPromise()
        .then(response => { 
          console.log('Pessoa atualizada com sucesso (via API):', response);
          return response; 
        })
        .catch(error => {
          // É bom tratar o erro aqui também ou relançá-lo para ser pego pelo subscribe no componente
          console.error('Erro na API ao atualizar pessoa:', error);
          throw error; // Relança o erro para o .catch() do .toPromise() ou o 'error' do subscribe
      })
    );
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Pessoa deletada com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
  
}
