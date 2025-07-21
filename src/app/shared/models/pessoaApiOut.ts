import { BaseResourceModel } from './base-resource.model';

export class PessoaApiOut extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
      public fisicaJuridica?: string,
      public situacao?: number,

      public tipoPessoaId?: number,
      public tipoPessoaNome?: string,

      public cpf?: string,
      public sexo?: string ,

      public estadoCivilId?: number ,
      public estadoCivilDesc?: string ,

      public dataNascimento?: string ,
      public nomeMae?: string ,
      public nomePai?: string,
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
