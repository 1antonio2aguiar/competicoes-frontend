import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { Categoria } from '../../shared/models/categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriasService extends BaseResourceService<Categoria>{

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'categorias', injector, Categoria.fromJson);
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
        const categorias = response.content;
        const resultado = {
          categorias,
        };
        //console.log('Resultado: ', resultado.categorias)
        return resultado;
    });
  }


  listAll(): Promise<Categoria[]> {
    //console.log('Passou aqui: ')
    return this.http
      .get<Categoria[]>(this.apiPath  + '/list')
      .toPromise();
  }
  
  create(categoria: Categoria): Observable<Categoria> {
    return from(this.http
      .post<Categoria>(this.apiPath, categoria)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Categoria criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(categoria: Categoria): Observable<Categoria> {
    //console.log('Categoria ', categoria)
    return from(this.http
      .put<Categoria>(`${this.apiPath}/${categoria.id}`, categoria)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Categoria atualizado com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Categoria deletado com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
}

