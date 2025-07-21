import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Filters } from '../../shared/filters/filters';

import { Prova } from '../../shared/models/prova';
import { Parametro } from '../../shared/models/parametro';

@Injectable({
  providedIn: 'root'
})

export class ParametrosService extends BaseResourceService<Parametro>{

  // parametro por id do parametro.
  private provaEventHendlerId: EventEmitter<Parametro>

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'parametro', injector, Parametro.fromJson);
    this.provaEventHendlerId = new EventEmitter<Parametro>();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;
    
    return this.http
      .get<any>(this.apiPath +'/filter', { params })
      .toPromise()
      .then((response) => {
        const parametros = response.content;
        const resultado = {
          parametros,
          total: response.totalElements,
        };
        console.table('Resultado: ', parametros)
        return resultado;
    });
  }

  listAll(): Promise<Parametro[]> {
    return this.http
      .get<Prova[]>(this.apiPath)
      .toPromise();
  }

  getParametroById(parametroId): Promise<Parametro> {
    return this.http.get<Prova>(this.apiPath + '/' + parametroId)
      .toPromise();
  }
  
}
