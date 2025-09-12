import { BaseResourceModel } from "./base-resource.model";

export class Perfil {
    id?: number;
    nome: string; // Ex: 'ROLE_ADMIN', 'ROLE_OPERADOR'

    static fromJson(jsonData: any): Perfil {
        return Object.assign(new Perfil(), jsonData);
    }
}