import { Injectable, Injector } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { TipoPessoa } from '../../shared/models/tipoPessoa';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TiposPessoasService extends BaseResourceService<TipoPessoa>{

    constructor(protected injector: Injector) {
      const baseUrl = environment.apiUrl.replace(/\/$/, ''); // remove barra final se houver
      super(`${baseUrl}/pessoas/tipos-pessoas`, injector, TipoPessoa.fromJson);
    }


    /*listAll(): Promise<TipoPessoa[]> {
        return this.http
        .get<TipoPessoa[]>(this.apiPath)
        .toPromise();
    }*/

  listAll(): Promise<TipoPessoa[]> {
    return this.http
      .get<TipoPessoa[]>(this.apiPath)
      .toPromise()
      .then(response => Array.isArray(response) ? response : [])
      .catch(error => {
        console.error('Erro ao carregar tipos pessoas via competicoes-api:', error);
        return [];
    });
  }

}