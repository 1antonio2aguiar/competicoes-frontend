import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { TiposNado } from '../../shared/models/tiposNado';

@Injectable({
  providedIn: 'root'
})

export class TiposNadoService extends BaseResourceService<TiposNado>{

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'tiposNado', injector, TiposNado.fromJson);
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = new HttpParams();
    params = params
      .append('page', filtro.pagina.toString())
      .append('size', filtro.itensPorPagina.toString());

    return this.http
    .get<any>(this.apiPath +'/filter', { })
      .toPromise()
      .then((response) => {
        const tiposNado = response.content;
        const resultado = {
          tiposNado,
          total: response.totalElements,
        };
        console.log('Resultado: ', resultado.tiposNado)
        return resultado;
    });
  }

  listAll(): Promise<TiposNado[]> {
    //console.log('Passou aqui: ')
    return this.http
      .get<TiposNado[]>(this.apiPath + '/list')
      .toPromise();
  }

  create(tiposNado: TiposNado): Observable<TiposNado> {
    return from(this.http
      .post<TiposNado>(this.apiPath, tiposNado)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('tipos Nado criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(tiposNado: TiposNado): Observable<TiposNado> {
    return from(this.http
      .put<TiposNado>(`${this.apiPath}/${tiposNado.id}`, tiposNado)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('tipos Nado atualizado com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('tipos Nado deletado com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
}
