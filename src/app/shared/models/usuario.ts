import { BaseResourceModel } from "./base-resource.model";
import { Empresa } from "./empresa";
import { Perfil } from "./perfil";

export class Usuario {
    id?: number;
    email: string; 
    nome: string;
    ativo: boolean = true;
    empresa?: Empresa; 
    empresaId?: number; 
    perfis?: Perfil[]; 
    perfisIds?: number[]; 

    static fromJson(jsonData: any): Usuario {
        return Object.assign(new Usuario(), jsonData);
  }
} 