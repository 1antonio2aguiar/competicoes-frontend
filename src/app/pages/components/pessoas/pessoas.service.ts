import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { environment } from '../../../../environments/environment';
import { Pessoa } from '../../../shared/models/pessoa';
import { AuthService } from '../../../shared/services/auth.service';

export class Filters {
  pagina = 0;
  itensPorPagina = 5;
  totalRegistros = 0;
  nome = '';
  cpf: string | null = null; 
  params = new HttpParams(); 
}


@Injectable({
  providedIn: 'root'
})

export class PessoasService extends BaseResourceService<Pessoa> {

  // pessoa por id.
  private pessoaEventHendlerId: EventEmitter<Pessoa>

  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
    super(environment.apiUrl + 'pessoas', injector, Pessoa.fromJson);
    this.pessoaEventHendlerId = new EventEmitter<Pessoa>();
  } 

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiPath + '/filter');
  }

  pesquisar(filtro: Filters): Promise<any> {
    let termoDeBusca = '';

    // Prioriza o que foi digitado no campo de nome
    if (filtro.nome && filtro.nome.trim() !== '') {
        termoDeBusca = filtro.nome;
    } else if (filtro.cpf && filtro.cpf.trim() !== '') {
        termoDeBusca = filtro.cpf;
    }

    let params = new HttpParams()
      .set('termo', termoDeBusca)

    return this.http
      .get<any>(this.apiPath = 'http://localhost:8080/pessoas/pesquisar', { params })
      .toPromise()
      .then((response) => {
        const pessoas = response; // A API retorna a lista diretamente

        const resultado = {
          pessoas: pessoas,
          total: pessoas.length
        };
        return resultado;
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        throw error;
      }
    );
  } 
  
  pessoaDisponiveisParaCadastro(filtro: Filters): Promise<any> {
    const empresaId = this.authService.getEmpresaId(); // Obtém o ID da empresa do serviço de autenticação
    let params = new HttpParams();
    params = params.set('empresaId', empresaId.toString()); // Adiciona o empresaId como parâmetro de consulta

    if (filtro.params) {
      filtro.params.keys().forEach(key => {
        params = params.set(key, filtro.params.get(key));
      });
    }

    console.log('params >>>>>>>>>>>>>>>>>>> ', params)

    return this.http
      .get<any>(this.apiPath = 'http://localhost:8080/atleta/disponiveis-para-cadastro', { params }) 
      .toPromise()
      .then((response) => {
        // Ajuste conforme a estrutura da sua resposta da API
        const pessoas = response.content
        const resultado = {
          pessoas,
          total: response.totalElements
        };
        return resultado;
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        throw error; // Re-lance o erro para ser tratado em outro lugar
      }
    );
  }
}
