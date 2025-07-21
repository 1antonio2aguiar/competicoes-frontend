import { Empresa } from './empresa';
import { BaseResourceModel } from './base-resource.model';
import { Equipe } from './equipe';
import { Pessoa } from './pessoa';
import { Categoria } from './categoria';

export class Atleta extends BaseResourceModel {
    constructor(
      public override id?: number,
      public observacao?: string,

      public empresaId?: number,
      public empresa?: Empresa,

      public pessoaId?: number,
      public pessoa?: Pessoa,

      public equipeId?: number,
      public equipe?: Equipe,

      public categoriaId?: number,
      public categoria?: Categoria,

    ) {
      super();
  }

  static fromJson(jsonData: any): Atleta {
    const atletas = {
      ...jsonData,
      empresaId: jsonData["empresa"]["id"],
      pessoaId:  jsonData["pessoa"]["id"],
      equipeId:  jsonData["equipe"]["id"],
      categoriaId:  jsonData["categoria"]["id"],
    };
    return Object.assign(new Atleta(), atletas);
 }

  static toJson(jsonData: any): Atleta {
      return Object.assign(new Atleta(), jsonData);
  }
}
