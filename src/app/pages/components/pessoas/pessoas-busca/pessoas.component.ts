import { Component, OnInit, Output, EventEmitter, OnDestroy, HostBinding, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbWindowService, NbWindowRef, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { PessoasService } from '../pessoas.service';
import { CpfPipe } from '../../../../shared/pipes/cpf.pipe';
import { CnpjPipe } from '../../../../shared/pipes/cnpj.pipe';
import { PorNomeComponent } from '../../../equipes/pessoas/componentes-busca/por-nome/por-nome.component';
import { PorCpfComponent } from '../../../equipes/pessoas/componentes-busca/por-cpf/por-cpf.component';
import { PorDataNascimentoComponent } from '../../../equipes/pessoas/componentes-busca/por-data-nascimento/por-data-nascimento.component';
import { TelaOrigemService } from '../../../../shared/services/tela-origem.service';

export class Filters {
  pagina = 0;
  itensPorPagina = 5;
  totalRegistros = 0;
  nome = '';
  cpf: string | null = null; 
  params = new HttpParams(); 
} 

@Component({
  selector: 'ngx-pessoas-busca',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit, OnDestroy {
  //width = 700;
  @Input() telaOrigem;

  private searchTerms = new Subject<string>();
  private searchSubscription: Subscription;

  source: LocalDataSource = new LocalDataSource();
  filtro = new Filters();
  loading = false;

  nameFilterComponent = (cell: any, search: string) => {
    if (!search) return true;
    this.filtro.nome = search;
    this.searchTerms.next(search);
    return String(cell).toLowerCase().indexOf(String(search).toLowerCase()) !== -1;
  }

  private cpfPipe = new CpfPipe();
  private cnpjPipe = new CnpjPipe();

  settings = {
    mode: 'external',
    
    pager: {
      perPage: this.filtro.itensPorPagina,
      display: true,
    },
    columns: {
      id: { title: 'ID', type: 'number', editable: false, addable: false, width: '50px', filter: false },

      nome: { 
        title: 'Nome', 
        type: 'string',
        filter: {
          type: 'custom',
          component: PorNomeComponent,
        },
      },

      cpfCnpj: {
      title: 'CPF/CNPJ',
      type: 'string',
      width: '190px',
      filter: {
        type: 'custom',
        component: PorCpfComponent,
      },
      valuePrepareFunction: (cell: any, row: any) => {
        // 'row' é o objeto completo da linha (ex: { id: ..., nome: ..., cpf: null, cnpj: "..." })
        if (row.cpf) {
          // Se o campo 'cpf' existir e tiver valor, formata como CPF
          return this.cpfPipe.transform(row.cpf);
        } else if (row.cnpj) {
          // Senão, se o campo 'cnpj' existir e tiver valor, formata como CNPJ
          return this.cnpjPipe.transform(row.cnpj);
        }
        // Se nenhum dos dois tiver valor, retorna uma string vazia
        return '';
      },
    },

    dataNascimento: {
        title: 'Data Nascimento',
        type: 'date',
        width: '200px',
        valuePrepareFunction: (data) => {
          if (data === null || data === undefined) {
            return ''; // Retorna uma string vazia se data for null ou undefined
          } else {
            const date = new Date(data);
            const day = (date.getDate() + 1).toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          }
        },
        filter: {
          type: 'custom',
          component: PorDataNascimentoComponent,
        },
      },
    },

    actions: { add: false, edit: false, delete: false },
    selectMode: 'single',
  };

  constructor(
    private pessoasService: PessoasService,
    private telaOrigemService: TelaOrigemService,
    private ref: NbWindowRef,
  ) {}

  ngOnInit(): void {
    this.telaOrigemService.setTelaOrigem(this.telaOrigem);

    //this.setupSearch();
    this.pesquisar();
    
  }

  selectItem(event) {
    //console.log('cell 1', event)
    if(!event.isSelected){
      this.ref.close(event.data); // Fecha o modal filho
    }
  }

  pesquisar(): Promise<any> {
    this.loading = true;

    // 1. Crie os parâmetros HTTP a partir dos valores do filtro
    let params = new HttpParams()
        // Adicione paginação se o seu backend suportar
        .set('page', this.filtro.pagina.toString()) 
        .set('size', this.filtro.itensPorPagina.toString());

    // 2. Adicione os filtros de nome e CPF dinamicamente
    if (this.filtro.nome) {
      params = params.set('nome', this.filtro.nome);
    }
    if (this.filtro.cpf) {
      params = params.set('cpf', this.filtro.cpf);
    }

    // 3. Atualize a propriedade 'params' do seu objeto 'filtro'
    this.filtro.params = params;

    // Agora a chamada para o serviço envia o objeto 'filtro' com os parâmetros corretos
    return this.pessoasService.pesquisar(this.filtro)
      .then(resultado => {
        this.source.load(resultado.pessoas);
        // Se a API retornar paginação, você pode atualizar o total aqui:
        // this.filtro.totalRegistros = resultado.totalElements; 
      })
      .catch(error => {
        console.error('Erro ao pesquisar pessoas:', error);
        this.source.load([]); // Limpa a tabela em caso de erro
        throw error;
      })
      .finally(() => {
        this.loading = false;
      });
  }


  ngOnDestroy() {
    this.searchTerms.unsubscribe(); // Important to prevent memory leaks!
  }

}
