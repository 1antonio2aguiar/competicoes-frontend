import { Injectable, Injector, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Modalidade } from '../../../shared/models/modalidade';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class ModalidadesService extends BaseResourceService<Modalidade>{

  private modalidadeEventHendlerId: EventEmitter<Modalidade>;

  constructor(protected injector: Injector) {
    super(environment.apiUrl + 'tiposModalidades', injector, Modalidade.fromJson);
    this.modalidadeEventHendlerId = new EventEmitter<Modalidade>;
  }

  
  // 1. Listar todos os registros (READ)
  listAll(): Promise<Modalidade[]> {
    //console.log('Chegou no service! ', this.apiPath + '/list')
    return this.http
      .get<Modalidade[]>(this.apiPath + '/list')
      .toPromise();
  }

  onModalidadeChangeService(event) {
    this.modalidadeEventHendlerId.emit(event); // Emitir o ID da modalidade selecionada
    //console.log('Modalidade select service:', event);
  }

  onModalidadeChangeId(callBack:(modalidade: Modalidade) => void){
    //console.log('Modalidade select buscou valor');
    this.modalidadeEventHendlerId.subscribe(callBack);
  }
}