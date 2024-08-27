import { Injectable, Injector } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Campeonato } from '../../shared/models/campeonato';
import { CampeonatosFiltro } from './campeonatos-filter';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class CampeonatosService extends BaseResourceService<Campeonato>{

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'campeonatos', injector, Campeonato.fromJson);
  }

  pesquisar(filtro: CampeonatosFiltro): Promise<any> {
    return this.http
      .get<any>(this.apiPath, {  })
      .toPromise()
      .then((response) => {
        const campeonatos = response.content;
        const resultado = {
          campeonatos,
          total: response.totalElements,
        };
        console.table('Resultado: ', resultado.campeonatos)
        return resultado;
    });
  }

  listAll(): Promise<Campeonato[]> {
    return this.http
      .get<Campeonato[]>(this.apiPath)
      .toPromise();
  }

  listAllList(): Promise<Campeonato[]> {
    return this.http
      .get<Campeonato[]>(this.apiPath + '/list')
      .toPromise();
  }

  create(modalidade: Campeonato): Observable<Campeonato> {
    return from(this.http
      .post<Campeonato>(this.apiPath, modalidade)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Campeonato criado com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(modalidade: Campeonato): Observable<Campeonato> {
    return from(this.http
      .put<Campeonato>(`${this.apiPath}/${modalidade.id}`, modalidade)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Campeonato atualizado com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Campeonato deletado com sucesso:', response); // Log para verificar a resposta
        return response;
      }));
  }
}

