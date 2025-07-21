// endereco.ts
import { BaseResourceModel } from './base-resource.model';

export class DocumentoOut extends BaseResourceModel {
  constructor(
    public id?: number,
    public tipoDocumento?: number,
    public tipoDocumentoDescricao?: string,
    public numeroDocumento?: string,
    public complemento?: string,
    public orgaoExpedidor?: string,
    public dataExpedicao?: Date,
    public dataValidade?: Date,
    
    public pessoaNome?: string,
    public pessoaId?: number,

  ) {
      super();
  }

  static fromJson(jsonData: any): DocumentoOut {
    const documentos = {
      ...jsonData,
    };
    return Object.assign(new DocumentoOut(), documentos);
 }
}
