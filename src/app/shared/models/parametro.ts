import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Campeonato } from './campeonato';
import { Etapa } from './etapa';

export class Parametro extends BaseResourceModel {
    constructor(
      public override id?: number,
      public numero?: number,
      public descricao?: string,

      public campeonatoId?: number,
      public campeonato?: Campeonato,

      public etapaId?: number,
      public etapa?: Etapa,

    ) {
      super();
  }

  static fromJson(jsonData: any): Parametro {
    const parametros = {
      ...jsonData,
      campeonatoId: jsonData["campeonato"]["id"],
      etapaId:      jsonData["etapa"]["id"],
    };
    return Object.assign(new Parametro(), parametros);
 }

  static toJson(jsonData: any): Parametro {
      return Object.assign(new Parametro(), jsonData);
  }
}
