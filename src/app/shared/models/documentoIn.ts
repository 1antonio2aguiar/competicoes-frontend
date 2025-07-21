import { BaseResourceModel } from './base-resource.model';

export class DocumentoIn extends BaseResourceModel {
    constructor(
      public override id?: number,
      public tipoDocumento?: string,
      public numeroDocumento?: string,
      public complemento?: string,
      public orgaoExpedidor?: string,
      public dataExpedicao?: Date,
      public dataValidade?: Date,

      public pessoaId?: number,

    ) {
      super();
  }

  static fromJson(jsonData: any): DocumentoIn {
    const documentosIn = {
      ...jsonData
    };
    return Object.assign(new DocumentoIn(), documentosIn);
  }

  static toJson(jsonData: any): DocumentoIn {
      return Object.assign(new DocumentoIn(), jsonData);
  }
}
