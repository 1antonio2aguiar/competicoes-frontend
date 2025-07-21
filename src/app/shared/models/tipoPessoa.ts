import { BaseResourceModel } from './base-resource.model';

export class TipoPessoa extends BaseResourceModel {
  constructor(
    public override id?: number,
    public nome?: string
  ) {
  super();
}

  static fromJson(jsonData: any): TipoPessoa {
      return Object.assign(new TipoPessoa(), jsonData);
  }
}
