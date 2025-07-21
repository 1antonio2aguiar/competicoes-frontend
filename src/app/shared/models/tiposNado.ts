import { BaseResourceModel } from './base-resource.model';

export class TiposNado extends BaseResourceModel {
  constructor(
    public override id?: number,
    public descricao?: string,
  ) {
  super();
}

  static fromJson(jsonData: any): TiposNado {
      return Object.assign(new TiposNado(), jsonData);
  }
}
