import { BaseResourceModel } from './base-resource.model';

export class Categoria extends BaseResourceModel {
  constructor(
    public override id?: number,
    public descricao?: string,
    public dataIniCategoria?: Date,
    public dataFinCategoria?: Date,
  ) {
    super();
  }

  static fromJson(jsonData: any): Categoria {
    return Object.assign(new Categoria(), jsonData);
  }
}
