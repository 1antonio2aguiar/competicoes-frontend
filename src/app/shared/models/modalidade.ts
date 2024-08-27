import { BaseResourceModel } from './base-resource.model';

export class Modalidade extends BaseResourceModel {
  constructor(
    public override id?: number,
    public nome?: string,
    public descricao?: string,
  ) {
  super();
}

  static fromJson(jsonData: any): Modalidade {
      return Object.assign(new Modalidade(), jsonData);
  }
}
