import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';

import { PessoasService } from '../../../../components/pessoas/pessoas.service';
import { FiltersPessoa } from '../FiltersPessoas';
import { TelaOrigemService } from '../../../../../shared/services/tela-origem.service';

@Component({
  selector: 'ngx-por-data-nascimento',
  templateUrl: './por-data-nascimento.component.html',
  styleUrls: ['./por-data-nascimento.component.scss']
})

export class PorDataNascimentoComponent implements OnInit {
  @Input() query: string;
  inputControl = new FormControl();
  @Output() filterChange = new EventEmitter<string>();
  filtro: FiltersPessoa = new FiltersPessoa();
  source: LocalDataSource = new LocalDataSource();
  telaOrigem: string;

  constructor(
    private pessoasService: PessoasService,
    private telaOrigemService: TelaOrigemService,
  ) {
  }

  ngOnInit(): void {
    this.telaOrigem = this.telaOrigemService.getTelaOrigem(); // Obtém o valor do serviço

    this.inputControl.valueChanges.subscribe(value => {
      this.filterChange.emit(value);
    })
    if (this.query) {
      this.inputControl.setValue(this.query)
    }
  }
  ngOnDestroy() {
    this.inputControl.reset();
  }

  pesquisarPorDataNascimento(search: string, pagina: number): Promise<any> {

    const data = this.formatDate(search)
    this.filtro.params = new HttpParams();
    this.filtro.params = this.filtro.params.append('dadosPessoaFisicaFilter.dataNascimento', data);
    this.filtro.pagina = pagina;

    // Chamada condicional usando operador ternário
    // Isto aqui é o seguinte quando estiver cadastrando um atleta executa o metodo pessoaNotInEquipes que faz um filtro
    // para não trazar pessoas que já estjam cadastradas por outras equipes. 
    const serviceMethod = this.telaOrigem === 'Atleta' ? 
                          this.pessoasService.pessoaNotInEquipes : 
                          this.pessoasService.pesquisar;
  
  
    return serviceMethod.call(this.pessoasService, this.filtro) // Chama o método correto
        .then(resultado => {
          this.filtro.totalRegistros = resultado.total;
          this.source.load(resultado.pessoas);
        })
        .catch(error => {
          console.error('Erro ao pesquisar pessoas:', error);
          throw error;
    });
  }

  // Função para formatar a data para mm/dd/yyyy
  private formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
  }

}