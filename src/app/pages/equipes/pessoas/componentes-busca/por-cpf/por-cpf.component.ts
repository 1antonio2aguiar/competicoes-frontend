import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';

import { PessoasService } from '../../../../components/pessoas/pessoas.service';
import { FiltersPessoa } from '../FiltersPessoas';
import { CpfPipe } from '../../../../../shared/pipes/cpf.pipe';
import { TelaOrigemService } from '../../../../../shared/services/tela-origem.service';

@Component({
  selector: 'ngx-por-cpf',
  templateUrl: './por-cpf.component.html',
  styleUrls: ['./por-cpf.component.scss']
})

export class PorCpfComponent implements OnInit {
  @Input() query: string;
  inputControl = new FormControl();
  @Output() filterChange = new EventEmitter<string>();
  filtro: FiltersPessoa = new FiltersPessoa();
  source: LocalDataSource = new LocalDataSource();
  private cpfPipe = new CpfPipe(); // Instancia o CpfPipe
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

  pesquisarPorCpf(search: string, pagina: number): Promise<any> {

    this.filtro.params = new HttpParams();
    this.filtro.params = this.filtro.params.append('dadosPessoaFisicaFilter.cpf', search);
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
}