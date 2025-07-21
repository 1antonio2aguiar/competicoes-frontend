import { BaseResourceModel } from './base-resource.model';

export class DadosPessoaFisica extends BaseResourceModel {
  constructor(
    public override id?: number,
    public cpf?: string,
    public sexo?: string,
    public estadoCivil?: string,
    public dataNascimento?: Date
  ) {
    super();
  }

  static fromJson(jsonData: any): DadosPessoaFisica {
      return Object.assign(new DadosPessoaFisica(), jsonData);
  }
}
