import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { PessoaApiService } from '../pessoa-api.service';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // IMPORTAR Router
import { NbDialogService, NbToastrService,  } from '@nebular/theme';

import { PessoaApiOut } from '../../../shared/models/pessoaApiOut';
import { MyDatepickerCustonComponent } from '../../components/date-picker/my-datepicker-custon.component';
import { CpfPipe } from '../../../shared/pipes/cpf.pipe';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete-modal.component';
import { CnpjPipe } from '../../../shared/pipes/cnpj.pipe';

export class Filters {
  pagina = 0;
  itensPorPagina = 5;
  totalRegistros = 0;
  nome = '';
  cpf: string | null = null; 
  cnpj: string | null = null;
  params = new HttpParams(); 
}

@Component({
  selector: 'ngx-pessoa-api-pesquisa',
  templateUrl: './pessoa-api-pesquisa.component.html',
  styleUrls: ['./pessoa-api-pesquisa.component.scss']
})

export class PessoaApiPesquisaComponent implements OnInit, OnDestroy{
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  isLoading = false;

  // Este obj é para passar para o modal add/edit
  dadosPessoa: PessoaApiOut | null = null;

  private cpfPipeInstance = new CpfPipe();
  private cnpjPipeInstance = new CnpjPipe();


  settings = {
    mode: 'external',

    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
        width: '100px',
        hide: false,
        filter: true, 
        filterFunction: false,
      },

      empresa: {
        title: 'Empresa',
        type: 'number',
        hide: true,
        valuePrepareFunction: (empresa) => {
          return empresa.value = 1;
        },
      },

      nome: {
        title: 'Nome',
        type: 'object',
        filter: true, 
         valuePrepareFunction: (cell, row) => row.nome || '',
        filterFunction: false,
      },

      cpfCnpj: { 
        width: '170px',
        title: 'CPF/CNPJ',
        type: 'object', 
       valuePrepareFunction: (cell: any, row: any) => {
          if (row.cpfCnpj) {
            return this.cpfPipeInstance.transform(row.cpfCnpj);
          } else if (row.cnpj) {
            return this.cnpjPipeInstance.transform(row.cpfCnpj);
          }
          return '';
        },
        filter: true, 
        filterFunction: false,
      },

      dataNascimento: {
        width: '170px',
        title: 'Data Nascimento',
        type: 'date', // MUITO IMPORTANTE: tipo 'custom' para filtro
        //renderComponent: null, // Não estamos customizando a renderização da célula, apenas o filtro
        valuePrepareFunction: (cellValue, row) => {
          if (row.dataNascimento && typeof row.dataNascimento === 'string') { // Certifique-se que é uma string
            try {
              // Assumindo que row.dataNascimento é "YYYY-MM-DD"
              const parts = row.dataNascimento.split('-');
              if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10); // Mês da string (1-12)
                const day = parseInt(parts[2], 10);

                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                  // Criar um objeto Date usando componentes UTC para evitar shifts de fuso horário local
                  // ao usar getDate(), getMonth() etc. que usam hora local.
                  // Ou, mais simples, se você só quer os componentes como estão na string:
                  return `${('0' + day).slice(-2)}/${('0' + month).slice(-2)}/${year}`;
                }
              }
              // Se o formato não for YYYY-MM-DD ou o parse falhar, retorna o original
              console.warn("Formato de dataNascimento inesperado para exibição:", row.dataNascimento);
              return row.dataNascimento;
            } catch (e) {
              console.warn("Erro ao parsear dataNascimento para exibição:", row.dataNascimento, e);
              return row.dataNascimento;
            }
          }
          return '';
        },
        /*filter: {
          type: 'custom', // MUITO IMPORTANTE: tipo 'custom' para filtro
          component: MyDatepickerCustonComponent
        },*/
        //filterFunction: false, // A filtragem continua no servidor
         filter: false, 
      },

      situacao: {
      title: 'Situação',
      type: 'string', 
      width: '120px', 
      filter: false, 
      valuePrepareFunction: (cellValue, row) => {
        const situacaoId = cellValue; 
        switch (situacaoId) {
          case 0:
            return 'ATIVO';
          case 1:
            return 'INATIVO';
          case 2:
            return 'BLOQUEADO';
          default:
            return situacaoId !== undefined && situacaoId !== null ? situacaoId.toString() : 'Desconhecido';
        }
      },
    },

    }
  }
  
  constructor(
      private pessoaApiService: PessoaApiService, 
      private router: Router,
      private route: ActivatedRoute,
      private dialogService: NbDialogService,
    ) {
      // Inicializar o filtro com valores padrões
      this.filtro.pagina = 0;    // Se o backend for 0-based para 'page'
      this.filtro.itensPorPagina = 40; // <<< Quantos você quer que o BACKEND retorne
      this.settings.pager.perPage = 5;
  }

  ngOnInit(): void {
    this.listarPessoas();

    this.source.onChanged().subscribe((change) => {
      const qtdLinhas = change.filter.filters.length
      const searchValue = change?.filter?.filters?.[qtdLinhas - 1]?.search ;
      
      if (change.filter.filters.length === 0 || searchValue === "") {
        return; 
      }
      
      if (change.action === 'filter') {
        this.onTableFilter(change.filter);
      }
    });
  }

  ngOnDestroy() {
    console.log('PessoaApiPesquisaComponent DESTRUÍDO');
  }

  listarPessoas(): void {
    this.filtro.pagina = 0; // Geralmente a primeira página é 1, mas depende da API
    this.filtro.itensPorPagina = 1000; // Pegue muitos para calcular corretamente

    this.filtro.params = new HttpParams();
    this.filtro.params = this.filtro.params.append('sort', 'nome');

    this.isLoading = true;
    //console.log('Buscando pessoas da pessoas-api...');

    this.pessoaApiService.listar({ ...this.filtro })
      .then((response: { pessoa: PessoaApiOut[], total: number }) => { // Tipagem da resposta
        if (response && response.pessoa) {
          console.log(`Recebidas ${response.pessoa.length} pessoas de um total de ${response.total}`);
          this.source.load(response.pessoa); // Carrega os dados no LocalDataSource
          // O LocalDataSource fará a paginação com 'itemsPerPageFrontend'
        } else {
          console.warn('Nenhuma pessoa retornada pela API ou formato de resposta inesperado.');
          this.source.load([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar pessoas:', error);
        this.source.load([]); // Limpa a tabela em caso de erro
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onAdd(): void {
    this.router.navigate(['cadastrar'], { relativeTo: this.route.parent }); 
  }

  onEdit(event: any) {
    const pessoaNome = (event.data.nome); 
    const pessoaId   = event.data.id;

    this.router.navigate(['editar', pessoaId], { // 'editar/:id'
      relativeTo: this.route.parent,
      state: { pessoaNome: pessoaNome } // <<< AQUI passa o pessoaNome
    });
  }

  onDelete(event): void {

    this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Excluir Pessoa',
        message: `Tem certeza que deseja excluir a Pessoa  ${event.data.id} ${event.data.nome}?`,
        data: event.data
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.pessoaApiService.delete(event.data.id).subscribe(() => {
          this.listarPessoas();
        },
          (error) => {
            console.error("Erro ao excluir pessoa:", error);
          });
      }
    });
  }

  onTableFilter(filterEvent: any): void {
    // Resetar o objeto de filtro
    this.filtro = new Filters();
    let termoDeBusca = '';

    const activeFilters = filterEvent?.filters || [];

    // ng2-smart-table permite múltiplos filtros, mas sua lógica atual
    // usa um único "termo". Vamos pegar o último filtro aplicado.
    if (activeFilters.length > 0) {
        const ultimoFiltro = activeFilters[activeFilters.length - 1];
        const field = ultimoFiltro.field;
        const search = ultimoFiltro.search;

        if (search && search.trim().length >= 3) {
            // Preenche o objeto de filtro
            if (field === 'nome') {
                this.filtro.nome = search.trim();
                termoDeBusca = this.filtro.nome;
            } else if (field === 'cpfCnpj') { // << Usando o campo combinado
                // Removemos formatação para enviar apenas números, se houver
                const valorNumerico = search.trim().replace(/\D/g, '');
                // O backend pode diferenciar por tamanho, mas o serviço atual combina em 'termo'
                this.filtro.cpf = valorNumerico;  // Preenche tanto cpf quanto cnpj
                this.filtro.cnpj = valorNumerico; // com o mesmo valor numérico
                termoDeBusca = valorNumerico;
            }
            // Adicionar outros campos como 'id' ou 'dataNascimento' aqui se necessário
        }
    }

    // Se não há um termo de busca válido, mas a ação foi limpar os filtros,
    // a busca será feita com termo vazio, trazendo todos os resultados.
    if (!termoDeBusca && activeFilters.length > 0) {
        console.log("Termo de busca muito curto. Não buscando.");
        return; // Não faz a chamada à API se o termo for muito curto
    }

    this.isLoading = true;

    // A chamada ao serviço agora usa o `termoDeBusca` montado.
    // O seu serviço `pesquisar` já lida com a lógica de enviar o `termo`.
    this.pessoaApiService.pesquisar(this.filtro,true) // Passamos o objeto filtro que contém nome/cpf/cnpj
      .then(response => {
        const pessoas = response.pessoas || [];
        this.source.load(pessoas);
      })
      .catch(error => {
        console.error("Erro ao pesquisar pessoas com filtro:", error);
        this.source.load([]);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Limpa o filtro anterior, só e possivel filtrar por uma coluna.
  onFilterFocus(event: FocusEvent): void {
    // O target é o elemento que REALMENTE recebeu o foco (o <input> ou <select>)
    const targetElement = event.target as HTMLElement;

    if (targetElement && (targetElement.tagName === 'INPUT')){
      //console.log('targetElement ', targetElement.tagName)

      // Tenta encontrar a célula do cabeçalho (<th>) pai mais próxima
      const headerCell = targetElement.closest('th');

      if (headerCell) {
        const headerClasses = headerCell.classList;

        //console.log('headerClasses ', headerClasses)

        // Define os campos de filtro que você quer monitorar
        const monitoredFilterFields = ['id','nome', 'cpfCnpj', 'dataNascimento'];

        // Procura por uma classe que corresponda a um dos campos monitorados
        let fieldName: string | null = null;
        for (const field of monitoredFilterFields) {
          if (Array.from(headerClasses).some(cls => cls.toLowerCase().includes(field.toLowerCase()))) {
             fieldName = field;
             break; // Encontrou o campo correspondente
          }
        }

        // Se encontrou um nome de campo correspondente, dispara sua lógica
        if (fieldName) {
          this.source.setFilter([], true);
        }
      }
    }
  }
 
}
