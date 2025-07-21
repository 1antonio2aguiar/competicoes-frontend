import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Modalidade } from './modalidade';
import { Pessoa } from './pessoa';

export class Equipe extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
      public sigla?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public agremiacaoId?: number,
      public agremiacao?: Pessoa,

      public modalidadeId?: number,
      public modalidade?: Modalidade,

      public tecnicoId?: number,
      public tecnico?: Pessoa,

      public assistenteTecnicoId?: number,
      public assistenteTecnico?: Pessoa,

    ) {
      super();
  }

  static fromJson(jsonData: any): Equipe {
    const equipes = {
      ...jsonData,
      empresaId: jsonData["empresa"]["id"],
      agremiacaoId:  jsonData["agremiacao"]["id"],
      modalidadeId:  jsonData["modalidade"]["id"],
      tecnicoId:  jsonData["tecnico"]["id"],
      assistenteTecnicoId:  jsonData["assistenteTecnico"]["id"],
    };
    return Object.assign(new Equipe(), equipes);
 }

  static toJson(jsonData: any): Equipe {
      return Object.assign(new Equipe(), jsonData);
  }
}
