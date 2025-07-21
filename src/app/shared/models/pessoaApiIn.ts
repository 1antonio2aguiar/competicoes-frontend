import { BaseResourceModel } from './base-resource.model';

export class PessoaApiIn extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
      public fisicaJuridica?: string,
      public situacao?: number,

      public tipoPessoaId?: number,
      public tipoPessoaNome?: string,

      public cnpjCpf?: string,
      public sexo?: string ,
      public estadoCivil?: string ,
      public dataNascimento?: string ,
      public nomeMae?: string ,
      public nomePai?: string,
      public observacao?: string ,

    ) {
      super();
  }

  static fromJson(jsonData: any): PessoaApiIn {
    const pessoasApiIn = {
      ...jsonData
    };
    return Object.assign(new PessoaApiIn(), pessoasApiIn);
 }

  static toJson(jsonData: any): PessoaApiIn {
      return Object.assign(new PessoaApiIn(), jsonData);
  }
}
