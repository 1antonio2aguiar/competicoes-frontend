import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { Etapa } from '../../shared/models/etapa';
import { Filters } from '../../shared/filters/filters';
import { HttpParams } from '@angular/common/http';
import EtapaOutput from '../../shared/models/etapaOutput';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
}) 

@Injectable()
export class EtapasService extends BaseResourceService<Etapa>{
  // etapa por id.
  private etapaEventHendlerId: EventEmitter<Etapa>

  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
    super(environment.apiUrl + 'etapas', injector, Etapa.fromJson);
    this.etapaEventHendlerId = new EventEmitter<Etapa>();
  }

  pesquisar(filtro: Filters): Promise<any> {
    let params = new HttpParams();
    const empresaId = this.authService.getEmpresaId(); // Obtém o ID da empresa do serviço de autenticação
    params = params.set('empresaId', empresaId.toString()); // Adiciona o empresaId como parâmetro de consulta
    
    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    return this.http
      .get<any>(this.apiPath, { params })
      .toPromise()
      .then((response) => {
        const etapas = response.content;
        const resultado = {
          etapas
        };
        //console.table('Resultado: ', etapas)
        return resultado;
        //return etapas
    });
  }

  listAll(): Promise<Etapa[]> {
    let params = new HttpParams();
    const empresaId = this.authService.getEmpresaId(); // Obtém o ID da empresa do serviço de autenticação
    params = params.set('empresaId', empresaId.toString()); // Adiciona o empresaId como parâmetro de consulta

    return this.http
      .get<Etapa[]>(this.apiPath , { params: params }) // Passa os parâmetros na requisição GET
      .toPromise();
  }

  getEtapaById(etapaId): Promise<Etapa> { // Retorna Promise<Etapa>
    return this.http.get<Etapa>(this.apiPath + '/' + etapaId)
      .toPromise();
  }

  etapasubscribeId(callBack:(etapa: EtapaOutput) => void){
    this.etapaEventHendlerId.subscribe(callBack)
  }

  create(etapa: Etapa): Observable<Etapa> {
    //console.log('chegou n service :', etapa);
    return from(this.http
      .post<Etapa>(this.apiPath, etapa)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Etapa criada com sucesso:', response); // Log para verificar a resposta
        return response; // Retorna a resposta para o Observable
    }));
  }

  update(etapa: Etapa): Observable<Etapa> {
    return from(this.http
      .put<Etapa>(`${this.apiPath}/${etapa.id}`, etapa)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        //console.log('Etapa atualizada com sucesso:', response);
        return response;
    }));
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Etapa deletada com sucesso:', response); // Log para verificar a resposta
        return response;
      }));
  }
}
