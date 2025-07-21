import { Injectable, Injector } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { CepApiOut } from '../../shared/models/cepApiOut';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class CepService extends BaseResourceService<CepApiOut>{

    constructor(protected override injector: Injector) {
        super(environment.pessoasApiUrl + 'cep', injector, CepApiOut.fromJson);
    }

    findByCep(numeroCep: string): Observable<CepApiOut> {
        const url = `${this.apiPath}/numero/${numeroCep}`;
        return this.http.get<CepApiOut>(url); 
    }
}