import { Injectable, Injector, EventEmitter } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { PessoaApiOut } from '../../shared/models/pessoaApiOut';
import { PessoaApiIn } from '../../shared/models/pessoaApiIn';
import { from, Observable } from 'rxjs';

export class Filters {
  pagina = 0;
  itensPorPagina = 5;
  totalRegistros = 0;
  nome = '';
  cpf: string | null = null; 
  cnpj: string | null = null; 
  params = new HttpParams(); 
}

@Injectable({
  providedIn: 'root'
})

export class PessoaApiService extends BaseResourceService<PessoaApiOut>{
  // pessoa por id.
  private pessoaEventHendlerId: EventEmitter<PessoaApiOut>

  constructor(protected injector: Injector) {
    super(environment.pessoasApiUrl + 'pessoaFisica', injector, PessoaApiOut.fromJson);
    this.pessoaEventHendlerId = new EventEmitter<PessoaApiOut>();
  } 

  getPessoaById(pessoaId: number): Promise<PessoaApiOut> {
    const url = `${environment.pessoasApiUrl}pessoa/${pessoaId}`;
    return this.http.get<PessoaApiOut>(url).toPromise();
  }

  getPessoaCompletaById(pessoaId: number): Promise<PessoaApiOut> {
    const url = `${environment.pessoasApiUrl}pessoa/${pessoaId}/completo`;
    return this.http.get<PessoaApiOut>(url).toPromise();
  }

  listar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath , { params })
      .toPromise()
      .then((response) => {
        const pessoa = response.content;
        const resultado = {
          pessoa,
          total: response.totalElements,
        };
        console.table('Resultado Geral>>>: ', pessoa)
        return resultado;
    });
  }

  pesquisar(filtro: Filters, completo: boolean = false): Promise<{ pessoas: any[], total: number }> {
      let termoDeBusca = '';
  
      // Monta o termo de busca a partir do filtro.
      // A lógica de prioridade é: nome > cpf > cnpj
      if (filtro.nome && filtro.nome.trim() !== '') {
          termoDeBusca = filtro.nome.trim();
      } else if (filtro.cpf && filtro.cpf.trim() !== '') {
          termoDeBusca = filtro.cpf.trim();
      } else if (filtro.cnpj && filtro.cnpj.trim() !== '') {
          termoDeBusca = filtro.cnpj.trim();
      }

       // Se não há termo de busca, não faz a chamada.
      if (termoDeBusca === '') {
          return Promise.resolve({ pessoas: [], total: 0 }); // Retorna um resultado vazio
      }
  
      let params = new HttpParams()
        .set('termo', termoDeBusca)
        .set('completo', completo.toString());

      const url = `${environment.apiUrl}pessoas/pesquisar`;
  
      return this.http
        .get<any[]>(url, { params }) // A resposta será um array (List<?>)
        .toPromise()
        .then((response: any[]) => {
          const pessoas = response || [];
          const resultado = {
            pessoas: pessoas,
            total: pessoas.length // A busca por termo não é paginada, então o total é o tamanho da lista
          };
          console.log(`Retorno da busca por termo '${termoDeBusca}' (completo=${completo}):`, pessoas);
          return resultado;
        })
        .catch(error => {
          console.error('Erro na requisição de pesquisa:', error);
          // Retornar um resultado vazio em caso de erro para não quebrar o componente
          return { pessoas: [], total: 0 };
        });
      }

  /*
    Esse aqui funciona belezinha se precisar pega apenas pessoa fisica.
  
  pesquisar(filtro: Filters): Promise<any> {
    let params = filtro.params;

    return this.http
      .get<any>(this.apiPath + '/filter?', { params })
      .toPromise()
      .then((response) => {
        const pessoa = response.content;
        const resultado = {
          pessoa,
          total: response.totalElements,
        };
        console.table('Resultado: ', pessoa)
        return resultado;
    });
  }*/

  create(pessoaApi: PessoaApiIn): Observable<PessoaApiIn> {
    return from(this.http
      .post<PessoaApiOut>(this.apiPath, pessoaApi)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Pessoa criada com sucesso:', response);
        return response; // Retorna a resposta para o Observable
      }));
  }

  update(pessoaApi: PessoaApiIn): Observable<PessoaApiIn> { 
      return from(this.http
        .put<PessoaApiOut>(`${this.apiPath}/${pessoaApi.id}`, pessoaApi)
        .toPromise()
        .then(response => { 
          console.log('Pessoa atualizada com sucesso (via API):', response);
          return response; 
        })
        .catch(error => {
          // É bom tratar o erro aqui também ou relançá-lo para ser pego pelo subscribe no componente
          console.error('Erro na API ao atualizar pessoa:', error);
          throw error; // Relança o erro para o .catch() do .toPromise() ou o 'error' do subscribe
      })
    );
  }

  delete(id: number): Observable<any> {
    return from(this.http
      .delete<any>(`${this.apiPath}/${id}`)
      .toPromise()
      .then(response => {
        // Lidar com a resposta da API
        console.log('Pessoa deletada com sucesso:', response); // Log para verificar a resposta
        return response;
    }));
  }
  
}
