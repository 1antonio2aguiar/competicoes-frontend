import { BaseResourceModel } from './base-resource.model';

export class Pontuacao extends BaseResourceModel {
  constructor(
    public override id?: number,
    public classificacao?: string,
    public pontos?: number
  ) {
  super();
}

  static fromJson(jsonData: any): Pontuacao {
      return Object.assign(new Pontuacao(), jsonData);
  }
}
