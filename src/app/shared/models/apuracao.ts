import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Prova } from './prova';
import { Atleta } from './atleta';
import { Pontuacao } from './pontuacao';
import { Inscricao } from './inscricao';

export class Apuracao extends BaseResourceModel {
    constructor(
      public override id?: number,
      public observacao?: string,
      public baliza?: number,
      public status?: number,
      public statusDescricao?: string,
      public resultado?: string,
      public tipoInscricao?: number,

      public empresaId?: number,
      public empresa?: Empresa,

      public provaId?: number,
      public prova?: Prova,

      public inscricaoId?: number,
      public insricao?: Inscricao,

      public atletaId?: number,
      public atleta?: Atleta,

      public pontuacaoId?: number,
      public pontuacao?: Pontuacao,

    ) {
      super();
  }

  static fromJson(jsonData: any): Apuracao {
    const apuracoes = {
      ...jsonData,
      empresaId:    jsonData["empresa"]["id"],
      provaId:      jsonData["prova"]["id"],
      inscricaoId:      jsonData["inscricao"]["id"],
      atletaId:     jsonData["atleta"]["id"],
      pontuacaod:   jsonData["pontuacao"]["id"],
    };
    return Object.assign(new Apuracao(), apuracoes);
 }

  static toJson(jsonData: any): Apuracao {
      return Object.assign(new Apuracao(), jsonData);
  }
}
