import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';

import { Equipe } from '../../shared/models/equipe';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class EquipesService extends BaseResourceService<Equipe>{

  // etapa por id.
  private equipeEventHendlerId: EventEmitter<Equipe>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'equipe', injector, Equipe.fromJson);
    this.equipeEventHendlerId = new EventEmitter<Equipe>();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = new HttpParams(); 

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    return this.http
    .get<any>(this.apiPath +'/filter', { params })
      .toPromise()
      .then((response) => {
        const equipes = response.content;
        const resultado = {
          equipes,
          total: response.totalElements,
        };
        console.table('Resultado: ', equipes)
        return resultado;
    });
  }

  listAll(): Promise<Equipe[]> {
    return this.http
      .get<Equipe[]>(this.apiPath)
      .toPromise();
  }

  getEquipeById(equipeId): Promise<Equipe> { // Retorna Promise<Equipe>
    return this.http.get<Equipe>(this.apiPath + '/' + equipeId)
      .toPromise();
  }

  create(equipe: Equipe): Observable<Equipe> {
    equipe.empresaId = 1;

    console.log('ta no create ', equipe)
    return from(this.http
      .post<Equipe>(this.apiPath, equipe)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Equipe criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(equipe: Equipe): Observable<Equipe> {
    
    equipe.empresaId = 1;

    return from(this.http
      .put<Equipe>(`${this.apiPath}/${equipe.id}`, equipe)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //.log('Equipe atualizada com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Equipe deletada com sucesso:', response); // Log para verificar a resposta
        return response;
      }));
  }
}

