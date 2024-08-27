import { Injectable } from '@angular/core';
import { ModalidadeData } from '../data/modalidade';

@Injectable()

export class ModalidadeService extends ModalidadeData {

  data = [{
    id: 1,
    nome: 'Natação',
    descricao: 'Esporte praticado em piscina',
  }, {
    id: 2,
    nome: 'Futebol',
    descricao: 'Esporte de habilidade força e inteligência',
  }, {
    id: 3,
    nome: 'Volleybol',
    descricao: 'Esporte de quadra',
  }];

  getData() {
    return this.data;
  }
}
