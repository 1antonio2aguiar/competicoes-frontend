import { BaseResourceModel } from './base-resource.model';

export class LocaisCompeticoes extends BaseResourceModel {
  constructor(
    public override id?: number,
    public empresa?: number,
    public nome?: string,
    public endereco?: string,
  ) {
  super();
}

static fromJson(jsonData: any): LocaisCompeticoes {
    return Object.assign(new LocaisCompeticoes(), jsonData);
  }
}
