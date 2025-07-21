import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { TipoPLogradouro } from '../../shared/models/tipoLogradouro';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TiposLogradouroService extends BaseResourceService<TipoPLogradouro>{

    constructor(protected injector: Injector) {
        super(environment.pessoasApiUrl + 'tipoLogradouro', injector, TipoPLogradouro.fromJson);
    }

    listAll(): Promise<TipoPLogradouro[]> {
        return this.http
        .get<TipoPLogradouro[]>(this.apiPath)
        .toPromise();
    }
}