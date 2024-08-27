import { Injectable, Injector } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Etapa } from '../../shared/models/etapa';
import { Filters } from '../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class EtapasService extends BaseResourceService<Etapa>{

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'etapas', injector, Etapa.fromJson);
  }

  pesquisar(filtro: Filters): Promise<any> {
    //const originalParams = new HttpParams();
    //let modifiedParams = originalParams;

    let params = filtro.params;

    if (filtro.campeonatoId) {
      params = params 
      .append('page', filtro.pagina.toString())
      .append('size', filtro.itensPorPagina.toString())
      .append('campeonato', filtro.campeonato.toString())

      console.log('Filtro ' , params)

    } else {
      params = params 
      .append('page', filtro.pagina.toString())
      .append('size', filtro.itensPorPagina.toString())
    }

    return this.http
      .get<any>(this.apiPath, { params })
      .toPromise()
      .then((response) => {
        const etapas = response.content;
        const resultado = {
          etapas,
          total: response.totalElements,
        };
        console.table('Resultado: ', resultado.etapas)
        return resultado;
    });
  }

  listAll(): Promise<Etapa[]> {
    return this.http
      .get<Etapa[]>(this.apiPath)
      .toPromise();
  }

  create(etapa: Etapa): Observable<Etapa> {
    return from(this.http
      .post<Etapa>(this.apiPath, etapa)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Etapa criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(etapa: Etapa): Observable<Etapa> {
    return from(this.http
      .put<Etapa>(`${this.apiPath}/${etapa.id}`, etapa)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Etapa atualizada com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Etapa deletada com sucesso:', response); // Log para verificar a resposta
        return response;
      }));
  }
}
