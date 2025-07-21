import { BaseResourceModel } from './base-resource.model';

export class TipoPLogradouro extends BaseResourceModel {
  constructor(
    public override id?: number,
    public descricao?: string,
    public sigla?: string
  ) {
  super();
}

  static fromJson(jsonData: any): TipoPLogradouro {
      return Object.assign(new TipoPLogradouro(), jsonData);
  }
}
