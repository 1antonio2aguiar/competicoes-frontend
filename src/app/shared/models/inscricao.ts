import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Prova } from './prova';
import { Atleta } from './atleta';
import { Pontuacao } from './pontuacao';

export class Inscricao extends BaseResourceModel {
    constructor(
      public override id?: number,
      public observacao?: string,
      public serie?: number,
      public baliza?: number,
      public status?: number,
      public statusDescricao?: string,
      public statusTipoInscricaoDescricao?: string,
      public equipeNome?: string,
      public campeonatoNome?: string,
      public etapaNome?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public provaId?: number,
      public prova?: Prova,

      public atletaId?: number,
      public atleta?: Atleta,
      public atletaNome?: string
      
    ) {
      super();
  }

  static fromJson(jsonData: any): Inscricao {
    const inscricoes = {
      ...jsonData,
      empresaId:    jsonData["empresa"]["id"],
      provaId:      jsonData["prova"]["id"],
      atletaId:     jsonData["atleta"]["id"],
    };
    return Object.assign(new Inscricao(), inscricoes);
 }

  static toJson(jsonData: any): Inscricao {
      return Object.assign(new Inscricao(), jsonData);
  }
}
