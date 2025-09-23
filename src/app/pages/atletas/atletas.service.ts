import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';
import { AuthService } from '../../shared/services/auth.service';
import { Atleta } from '../../shared/models/atleta';

@Injectable({
  providedIn: 'root'
})

export class AtletasService extends BaseResourceService<Atleta>{

  // etapa por id.
  private atletaEventHendlerId: EventEmitter<Atleta>

  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
      super(environment.apiUrl + 'atleta', injector, Atleta.fromJson);
      this.atletaEventHendlerId = new EventEmitter<Atleta>();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = new HttpParams();

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    return this.http
      .get<any>(this.apiPath + '/filter', { params })
      .toPromise()
      .then((response) => {
        const atletas = response.content;

        console.table('Atletas recebidos do back-end:', atletas);
        return atletas;
    });
  }

  listAll(): Promise<Atleta[]> {
    return this.http
      .get<Atleta[]>(this.apiPath)
      .toPromise();
  }
  
  getAtletaById(atletaId): Promise<Atleta> { 
    return this.http.get<Atleta>(this.apiPath + '/' + atletaId)
      .toPromise();
  }

  create(atleta: Atleta): Observable<Atleta> {
    atleta.empresaId = this.authService.getEmpresaId();

    return from(this.http
      .post<Atleta>(this.apiPath, atleta)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Atleta criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
      }));
  }
  
  update(atleta: Atleta): Observable<Atleta> {

    return from(this.http
      .put<Atleta>(`${this.apiPath}/${atleta.id}`, atleta)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //.log('Atleta atualizada com sucesso:', response);
        return response;
      }));
  }
  
  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Atleta deletado com sucesso:', response); // Log para verificar a resposta
        return response;
      }));
  }

}
