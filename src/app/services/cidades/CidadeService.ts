import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { LogradouroPesquisaOut } from '../../shared/models/logradouroPesquisaOut';
import { CidadePesquisaOut } from '../../shared/models/cidadePesquisaOut';

interface BackendCidadeRcd {
  id: number;
  cidadeNome: string;
  uf: string;
}

export interface CidadePesquisa {
  id: number;
  cidadeNome: string;
  uf: string;
}

@Injectable({
  providedIn: 'root'
})

export class CidadeService extends BaseResourceService<CidadePesquisaOut> {

    constructor(protected override injector: Injector) {
        super(environment.pessoasApiUrl + 'cidade', injector, CidadePesquisaOut.fromJson);
    }

    buscarCidadesPorNome(nome: string ): Observable<CidadePesquisa[]> {
        const cidadeApiPath = environment.pessoasApiUrl + 'cidade';
        let params = new HttpParams();

        // Adiciona os parâmetros apenas se eles tiverem valor
        if (nome) {
            params = params.set('nome', nome);
        }

        // 2. O 'get' agora espera um array diretamente: BackendLogradouroRcd[]
        return this.http.get<BackendCidadeRcd[]>(`${cidadeApiPath}/list`, { params }).pipe(
            tap(responseArray => {
                //console.log('Resposta CRUA da API de cidades (Array):', responseArray);
            }),
            // 3. O 'map' agora opera diretamente no array da resposta
            map(responseArray => responseArray.map(log => ({
                id: log.id,
                cidadeNome: log.cidadeNome,
                uf: log.uf,
            }))),
            catchError(err => {
                console.error('Erro ao buscar cidades por nome:', err);
                return of([]); // Retorna um array vazio em caso de erro
            })
        );
    }
}