import { BaseResourceModel } from './base-resource.model';

export class PessoaApiOut extends BaseResourceModel {
    constructor(
      public override id?: number,

      public empresaId?: number,
      public empresaNome?: string,

      public pessoaId?: number ,
      public pessoaNome?: string,
      
      public equipeId?: number,
      public equipeNome?: string,

      public categoriaId?: number ,
      public categoriaDescricao?: string ,

      public observacao?: string ,

    ) {
      super();
  }

  static fromJson(jsonData: any): PessoaApiOut {
    const pessoasApiOut = {
      ...jsonData
    };
    return Object.assign(new PessoaApiOut(), pessoasApiOut);
 }

  static toJson(jsonData: any): PessoaApiOut {
      return Object.assign(new PessoaApiOut(), jsonData);
  }
}
