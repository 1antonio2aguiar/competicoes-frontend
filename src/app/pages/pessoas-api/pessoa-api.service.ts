import { Injectable, Injector, EventEmitter } from '@angular/core';
import { BaseResourceService } from '../../shared/services/base-resource.service';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { PessoaApiOut } from '../../shared/models/pessoaApiOut';
import { PessoaApiIn } from '../../shared/models/pessoaApiIn';
import { from, Observable, throwError } from 'rxjs';

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
    super(environment.apiUrl, injector, PessoaApiOut.fromJson);
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

    const url = `${environment.apiUrl}pessoas/filtrarPessoas`;

    return this.http
      .get<any>(url , { params })
      .toPromise()
      .then((response) => {
        const pessoa = response.content;
        const resultado = {
          pessoa,
          total: response.totalElements,
        };
        //console.table('Resultado Geral>>>: ', pessoa)
        return resultado;
    });
  }

  pesquisar(filtro: Filters, completo: boolean = false): Promise<{ pessoas: any[], total: number }> {
    let termoDeBusca = '';

    if (filtro.nome && filtro.nome.trim() !== '') {
      termoDeBusca = filtro.nome.trim();
    } else if (filtro.cpf && filtro.cpf.trim() !== '') {
      termoDeBusca = filtro.cpf.trim();
    } else if (filtro.cnpj && filtro.cnpj.trim() !== '') {
      termoDeBusca = filtro.cnpj.trim();
    }

    if (termoDeBusca === '') {
      return Promise.resolve({ pessoas: [], total: 0 });
    }

    let params = new HttpParams()
      .set('termo', termoDeBusca)
      .set('completo', completo.toString());

    // CORREÇÃO AQUI 🔥🔥🔥
    const url = `${environment.pessoasApiUrl}pessoa/pesquisar`;

    return this.http
      .get<any[]>(url, { params })
      .toPromise()
      .then((response: any[]) => {
        const pessoas = response || [];
        return {
          pessoas,
          total: pessoas.length
        };
      })
      .catch(error => {
        console.error('Erro na requisição de pesquisa:', error);
        return { pessoas: [], total: 0 };
    });
  }


  public createPessoa(pessoa: PessoaApiIn): Observable<PessoaApiOut> {
    const targetPath = this.getTargetPath(pessoa.fisicaJuridica);
    if (!targetPath) {
      return throwError(() => new Error('Tipo de pessoa inválido. Deve ser "F" ou "J".'));
    }
    // Retorna o tipo PessoaApiOut, que é o que a API responde.
    return this.http.post<PessoaApiOut>(targetPath, pessoa);
  }

  public updatePessoa(pessoa: PessoaApiIn): Observable<PessoaApiOut> {

    //console.log('Chegou no upd com o objeto:', pessoa);

    const targetPath = this.getTargetPath(pessoa.fisicaJuridica);
    if (!targetPath || !pessoa.id) {
      return throwError(() => new Error('Dados inválidos para atualização (tipo ou ID ausente).'));
    }
    const url = `${targetPath}/${pessoa.id}`;
    // Retorna o tipo PessoaApiOut, que é o que a API responde.
    return this.http.put<PessoaApiOut>(url, pessoa);
  }

  private getTargetPath(tipoPessoa?: 'F' | 'J'): string {
    if (tipoPessoa === 'F') {
      return `${environment.pessoasApiUrl}pessoaFisica`;
    }
    if (tipoPessoa === 'J') {
      return `${environment.pessoasApiUrl}pessoaJuridica`;
    }
    return '';
  }

  delete(id: number): Observable<void> { // O tipo de retorno é 'void' pois um DELETE 204 não tem corpo
    const url = `${environment.apiUrl}pessoas/${id}`; // Use a URL base da sua API de competições
    
    // Simples, direto e retorna um Observable, como o Angular prefere.
    return this.http.delete<void>(url);
  }
  
}
