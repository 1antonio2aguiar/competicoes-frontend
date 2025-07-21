import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Campeonato } from './campeonato';
import { Etapa } from './etapa';
import { TiposNado } from './tiposNado';
import { Categoria } from './categoria';

export class Prova extends BaseResourceModel {
    constructor(
      public override id?: number,
      public observacao?: string,
      public distancia?: number,
      public genero?: string,
      public revezamento?: string,
      public medley?: string,
      public tipoPiscina?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public campeonatoId?: number,
      public campeonato?: Campeonato,

      public etapaId?: number,
      public etapa?: Etapa,

      public categoriaId?: number,
      public categoria?: Categoria,

      public tipoNadoId?: number,
      public tipoNado?: TiposNado,

    ) {
      super();
  }

  static fromJson(jsonData: any): Prova {
    const provas = {
      ...jsonData,
      empresaId: jsonData["empresa"]["id"],
      campeonatoId: jsonData["campeonato"]["id"],
      etapaId:      jsonData["etapa"]["id"],
      categoriad:   jsonData["categoria"]["id"],
      tipoNadoId:   jsonData["tipoNado"]["id"],
    };
    return Object.assign(new Prova(), provas);
 }

  static toJson(jsonData: any): Prova {
      return Object.assign(new Prova(), jsonData);
  }
}
