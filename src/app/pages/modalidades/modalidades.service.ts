import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { Modalidade } from '../../shared/models/modalidade';
import { ModalidadesFiltro } from './modalidades-filtro';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ModalidadesService extends BaseResourceService<Modalidade>{

  private modalidadeEventHendlerId: EventEmitter<Modalidade>;

    constructor(protected injector: Injector) {
        //super(environment.apiUrl + 'tiposModalidades/filter', injector, Modalidade.fromJson);
        super(environment.apiUrl + 'tiposModalidades', injector, Modalidade.fromJson);

        this.modalidadeEventHendlerId = new EventEmitter<Modalidade>;
    }

    pesquisar(filtro: ModalidadesFiltro): Promise<any> {
      let params = filtro.params;
      
      params = params
      .append('page', filtro.pagina.toString())
      .append('size', filtro.itensPorPagina.toString());
      
      //console.log('PARAMNETRO ', params)

      return this.http
        .get<any>(this.apiPath +'/filter', { params })
        .toPromise()
        .then((response) => {
          const modalidades = response.content;
          const total = response.totalElements; 
          const resultado = {
            modalidades,
            total: response.totalElements,
          };
          console.table('Resultado: ', response,  )
          return resultado;
    });
  }

  create(modalidade: Modalidade): Observable<Modalidade> {
    return from(this.http
      .post<Modalidade>(this.apiPath, modalidade)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Modalidade criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(modalidade: Modalidade): Observable<Modalidade> {
    return from(this.http
      .put<Modalidade>(`${this.apiPath}/${modalidade.id}`, modalidade)
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
  
  // 1. Listar todos os registros (READ)
  listAll(): Promise<Modalidade[]> {
    //console.log('Chegou no service! ',this.apiPath + '/list' )
    return this.http
      .get<Modalidade[]>(this.apiPath + '/list')
      .toPromise();
  }

}