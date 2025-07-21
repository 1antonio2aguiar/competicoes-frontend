import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Filters } from '../../../shared/filters/filters';
import { PessoaApiService } from '../pessoa-api.service';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // IMPORTAR Router
import { NbDialogService, NbToastrService,  } from '@nebular/theme';

import { PessoaApiOut } from '../../../shared/models/pessoaApiOut';
import { MyDatepickerCustonComponent } from '../../components/date-picker/my-datepicker-custon.component';
import { CpfPipe } from '../../../shared/pipes/cpf.pipe';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete-modal.component';

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
        filter: {
          type: 'custom', // MUITO IMPORTANTE: tipo 'custom' para filtro
          component: MyDatepickerCustonComponent
        },
        filterFunction: false, // A filtragem continua no servidor
      },

      cpf: { // O DTO 'PessoaApiResponse' que simulamos tinha 'cpf'
        width: '150px',
        title: 'CPF',
        type: 'object', // Se o DTO de resposta tiver 'cpf' como string
        valuePrepareFunction: (cellValue, row) => {
          // cellValue será row.cpf
          if (row.cpf) {
            return this.cpfPipeInstance.transform(row.cpf);
          }
          return '';
        },
        filter: true, 
        filterFunction: false,
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
    //console.log('Botão Adicionar (+) clicado');
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
    //console.log('Delete')

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
          //this.showToast('Inscrição excluída com sucesso!', 'success');
        },
          (error) => {
            //this.showToast('Erro ao excluir Inscrição!', 'danger');  // Adicionado o toast de erro
            console.error("Erro ao excluir Inscrição:", error);
          });
      }
    });
  }

  onTableFilter(filterEvent: any): void {
    // Limpa os parâmetros de filtro anteriores para construir um novo conjunto
    this.filtro.params = new HttpParams();
    let deveChamarApi = false; // Flag para controlar se a API será chamada

    const activeFiltersArray = (filterEvent && filterEvent.filters && Array.isArray(filterEvent.filters))
                             ? filterEvent.filters
                             : [];

    if (activeFiltersArray.length > 0) {
      activeFiltersArray.forEach(filter => {
        const field = filter.field;
        const search = filter.search;

        if (search && search.trim() !== '') {
          switch (field) {
            case 'id':
              this.filtro.params = this.filtro.params.set('id', search.trim());
              deveChamarApi = true; // Filtro de ID sempre chama a API
              break;
            case 'nome':
              if (search.trim().length >= 6) {
                this.filtro.params = this.filtro.params.set('nome', search.trim());
                deveChamarApi = true; // Chama a API se 'nome' tiver >= 4 caracteres
              }
              break;
            case 'cpf':
              if (search.trim().length >= 6) {
                this.filtro.params = this.filtro.params.set('cpf', search.trim());
                deveChamarApi = true; // Chama a API se 'nome' tiver >= 4 caracteres
              }
              break;
            case 'dataNascimento': 
              if (search && search.trim().length === 10) { 
                this.filtro.params = this.filtro.params.set('dataNascimento', search.trim());
                deveChamarApi = true;
              } else if (search && search.trim() !== '') {
                // Formato inválido ou data parcial (embora DateFilterComponent tente evitar isso)
                //console.warn("Formato de data inválido recebido do filtro:", search);
              }
          }
        }
      });
    }

    // Adiciona a ordenação padrão ou a última ordenação aplicada pela tabela
    this.filtro.params = this.filtro.params.append('sort', 'nome,asc'); // Ou pegue da tabela se ela suportar sort externo

    // Decide se realmente chama a API
    // A API só é chamada se 'deveChamarApi' foi setado para true por ALGUM filtro válido
    // OU se não há NENHUM filtro ativo (todos os campos de filtro da tabela estão vazios).
    if (deveChamarApi || activeFiltersArray.every(f => !f.search || f.search.trim() === '')) {
        if (activeFiltersArray.every(f => !f.search || f.search.trim() === '')) {
            //console.log("Nenhum filtro ativo, carregando lista padrão.");
            // Se todos os filtros foram limpos, this.filtro.params estará vazio (exceto sort)
        } else {
            console.log("Aplicando filtros e chamando API com:", this.filtro.params.toString());
        }

        this.filtro.itensPorPagina = 40; // Mantém o tamanho da página do backend

        // <<< BLOCO DE CONTROLE >>>
      this.isLoading = true; // Inicia o loading antes da chamada
      this.pessoaApiService.pesquisar({ ...this.filtro }) // Passa o objeto filtro com os params
        .then(response => {
          const pessoas = response.pessoa || [];
          //console.log('Dados recebidos da API (CPF/Data):', JSON.parse(JSON.stringify(pessoas)));
          this.source.load([...pessoas]);
          //console.log("Dados carregados na source após filtro CPF/Data. Count:", this.source.count());
        })
        .catch(error => {
          console.error("Erro ao pesquisar pessoas com filtro:", error);
          this.source.load([]); // Limpa em caso de erro
        })
        .finally(() => {
          this.isLoading = false; // Finaliza o loading
        });
      // <<< FIM DO BLOCO >>>

    } else {
        //console.log("Nenhum filtro válido ou com comprimento suficiente para acionar a busca na API. Tabela não atualizada pela API.");
        // Opcional: Limpar a tabela se nenhum filtro válido for encontrado e houver texto parcial
        // this.source.load([]);
    }
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
        const monitoredFilterFields = ['id','nome', 'cpf', 'dataNascimento'];

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
