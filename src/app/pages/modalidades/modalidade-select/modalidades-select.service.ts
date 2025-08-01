import { Injectable, Injector, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';

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
    return this.http
      .get<any>(this.apiPath) // << 1. Recebe 'any' para aceitar o objeto de paginação
      .pipe(
        map(response => response.content as Modalidade[]) // << 2. Extrai apenas o array 'content' da resposta
    )
    .toPromise(); // << 3. Converte o resultado (que agora é só o array) para Promise
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