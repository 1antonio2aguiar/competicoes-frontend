import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Filters } from '../../shared/filters/filters';

import { Empresa } from '../../shared/models/empresa';

@Injectable({
  providedIn: 'root' 
})

export class EmpresasService extends BaseResourceService<Empresa>{
  private empresaEventHendlerId: EventEmitter<Empresa>;

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'empresas', injector, Empresa.fromJson);
    this.empresaEventHendlerId = new EventEmitter<Empresa>;
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
        const empresas = response.content;
        const resultado = {
          empresas,
        };
        //console.log('Resultado: ', resultado.empresas)
        return resultado;
      }
    );
  }

  listAll(): Promise<Empresa[]> {
    //console.log('Chegou no service! ',this.apiPath + '/list' )
    return this.http
      .get<Empresa[]>(this.apiPath + '/list')
      .toPromise();
  }

  create(empresa: Empresa): Observable<Empresa> {
    return from(this.http
      .post<Empresa>(this.apiPath, empresa)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Modalidade criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
      }));
  }
  
  update(empresa: Empresa): Observable<Empresa> {
    return from(this.http
      .put<Empresa>(`${this.apiPath}/${empresa.id}`, empresa)
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