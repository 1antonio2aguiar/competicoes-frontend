import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { LogradouroPesquisaOut } from '../../shared/models/logradouroPesquisaOut';

interface BackendLogradouroRcd {
  id: number;
  tipoLogradouro: string;
  logradouroNome: string; // O nome da propriedade no DTO é logradouroNome
  bairros: { id: number; nome: string }[];
  cidadeNome: string;
  uf: string;
  cepId: number;
  cep: string; // CEP é string no backend
}

export interface LogradouroPesquisa {
  id: number;
  tipoLogradouro: string;
  logradouroNome: string;
  bairros: { id: number; nome: string }[];
  cidadeNome: string;
  uf: string;
  cepId: number;
  cep: string; // CEP é string
}

@Injectable({
  providedIn: 'root'
})

export class LogradouroService extends BaseResourceService<LogradouroPesquisaOut> {

    constructor(protected override injector: Injector) {
        super(environment.pessoasApiUrl + 'logradouro', injector, LogradouroPesquisaOut.fromJson);
    }

    buscarLogradourosPorTipoNome(nome: string, tipoLogradouroId: number, cidadeNome: string, cidadeId: number,): 
    Observable<LogradouroPesquisa[]> {
        const logradouroApiPath = environment.pessoasApiUrl + 'logradouro';
        let params = new HttpParams();

        // Adiciona os parâmetros apenas se eles tiverem valor
        if (nome) {
            params = params.set('nome', nome);
        }
        if (tipoLogradouroId) {
            params = params.set('tipoLogradouroId', tipoLogradouroId.toString());
        }
        if (cidadeNome) {
            params = params.set('cidadeNome', cidadeNome);
        }
        if (cidadeId) {
            params = params.set('cidadeId', cidadeId);
        }

        // 2. O 'get' agora espera um array diretamente: BackendLogradouroRcd[]
        return this.http.get<BackendLogradouroRcd[]>(`${logradouroApiPath}/por-cidade-tipo-nome`, { params }).pipe(
            tap(responseArray => {
                //console.log('Resposta CRUA da API de logradouros (Array):', responseArray);
            }),
            // 3. O 'map' agora opera diretamente no array da resposta
            map(responseArray => responseArray.map(log => ({
                id: log.id,
                tipoLogradouro: log.tipoLogradouro,
                logradouroNome: log.logradouroNome,
                bairros: log.bairros,
                cidadeNome: log.cidadeNome,
                uf: log.uf,
                cepId: log.cepId,
                cep: log.cep ? log.cep.toString() : '' // Pequena proteção para o caso de cep ser null
            }))),
            catchError(err => {
                console.error('Erro ao buscar logradouros por nome:', err);
                return of([]); // Retorna um array vazio em caso de erro
            })
        );
    }
}