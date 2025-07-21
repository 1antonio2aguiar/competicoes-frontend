import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { LocaisCompeticoes } from './locaisCompeticoes';
import { Campeonato } from './campeonato';

export class Etapa extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
      public descricao?: string,
      public data_etapa?: Date,
      public data_inscricao?: Date,

      public pontua?: string,
	    public acumula?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public campeonatoId?: number,
      public campeonato?: Campeonato,

      public localCompeticaoId?: number,
      public localCompeticao?: LocaisCompeticoes,

    ) {
      super();
  }

  static fromJson(jsonData: any): Etapa {
    const etapas = {
      ...jsonData,
      empresaId: jsonData["empresa"]["id"],
      campeonatoId:  jsonData["campeonato"]["id"],
      localCompeticaoId:  jsonData["localCompeticao"]["id"]
    };
    return Object.assign(new Etapa(), etapas);
 }

  static toJson(jsonData: any): Etapa {
      return Object.assign(new Etapa(), jsonData);
  }
}
