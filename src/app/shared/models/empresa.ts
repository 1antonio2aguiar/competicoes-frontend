import { BaseResourceModel } from "./base-resource.model";

export class Empresa extends BaseResourceModel {
    constructor(
      public override id?: number,
      public nome?: string,
    ) {
    super();
  }
  
    static fromJson(jsonData: any): Empresa {
        return Object.assign(new Empresa(), jsonData);
    }
  }