import { BaseResourceModel } from "./base-resource.model";

export class Empresa {
    id?: number;
    razaoSocial: string;
    atividade: string;
    telefone: string;
    cnpj: string;
    inscricaoEstadual: string;

    static fromJson(jsonData: any): Empresa {
      const empresa = new Empresa();
      empresa.id = jsonData.id;
      empresa.cnpj = jsonData.cnpj;
      empresa.razaoSocial = jsonData.RazaoSocial; // Mapeia RazaoSocial (API) para razaoSocial (Modelo)
      empresa.atividade = jsonData.Atividade;     // Mapeia Atividade (API) para atividade (Modelo)
      empresa.telefone = jsonData.telefone;
      empresa.inscricaoEstadual = jsonData.InscricaoEstadual; // Mapeia InscricaoEstadual (API) para inscricaoEstadual (Modelo)
      return empresa;
  }
}