import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Campeonato } from '../../../shared/models/campeonato';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class CampeonatosSelectService extends BaseResourceService<Campeonato>{

  private campeonatoEventHendlerId: EventEmitter<Campeonato>;

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'campeonatos', injector, Campeonato.fromJson);
    this.campeonatoEventHendlerId = new EventEmitter<Campeonato>;
  }

  
  // 1. Listar todos os registros (READ)
  listAll(): Promise<Campeonato[]> {
    console.log('Chegou no service! ',this.apiPath + '/list' )
    return this.http
      .get<Campeonato[]>(this.apiPath + '/list')
      .toPromise();
  }

  onCampeonatoChangeService(event) {
    this.campeonatoEventHendlerId.emit(event); // Emitir o ID da Campeonato selecionada
    console.log('Campeonato select service:', event);
  }

  onCampeonatoChangeId(callBack:(campeonato: Campeonato) => void){
    console.log('Campeonato select buscou valor');
    this.campeonatoEventHendlerId.subscribe(callBack);
  }
}