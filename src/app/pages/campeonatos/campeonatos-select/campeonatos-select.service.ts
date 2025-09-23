import { Injectable, Injector, EventEmitter } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Campeonato } from '../../../shared/models/campeonato';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class CampeonatosSelectService extends BaseResourceService<Campeonato>{

  private campeonatoEventHendlerId: EventEmitter<Campeonato>;

  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
    super(environment.apiUrl + 'campeonatos', injector, Campeonato.fromJson);
    this.campeonatoEventHendlerId = new EventEmitter<Campeonato>;
  }

  
  // 1. Listar todos os registros (READ)
  listAll(): Promise<Campeonato[]> {
    const empresaId = this.authService.getEmpresaId(); // Obtém o ID da empresa do serviço de autenticação
    let params = new HttpParams();
    params = params.set('empresaId', empresaId.toString()); // Adiciona o empresaId como parâmetro de consulta

    return this.http
      .get<Campeonato[]>(this.apiPath + '/list', { params: params }) // Passa os parâmetros na requisição GET
      .toPromise();
  }

  onCampeonatoChangeService(event) {
    this.campeonatoEventHendlerId.emit(event); // Emitir o ID da Campeonato selecionada
    //console.log('Campeonato select service:', event);
  }

  onCampeonatoChangeId(callBack:(campeonato: Campeonato) => void){
    //console.log('Campeonato select buscou valor');
    this.campeonatoEventHendlerId.subscribe(callBack);
  }
}