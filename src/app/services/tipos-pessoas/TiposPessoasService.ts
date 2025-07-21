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
        super(environment.pessoasApiUrl + 'tipoPessoa', injector, TipoPessoa.fromJson);
    }

    listAll(): Promise<TipoPessoa[]> {
        return this.http
        .get<TipoPessoa[]>(this.apiPath)
        .toPromise();
    }
}