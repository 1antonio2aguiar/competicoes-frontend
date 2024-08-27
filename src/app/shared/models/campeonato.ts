import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Modalidade } from './modalidade';

export class Campeonato extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
      public descricao?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public modalidadeId?: number,
      public modalidade?: Modalidade
    ) {
      super();
  }

  static fromJson(jsonData: any): Campeonato {
    const campeonatos = {
      ...jsonData,
      empresaId: jsonData["empresa"]["id"],
      modalidadeId:  jsonData["modalidade"]["id"]
    };
    return Object.assign(new Campeonato(), campeonatos);
 }

  static toJson(jsonData: any): Campeonato {
      return Object.assign(new Campeonato(), jsonData);
  }
}
