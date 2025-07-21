import { BaseResourceModel } from './base-resource.model';

// Interface para definir a estrutura de um objeto Bairro dentro do array
export interface Bairro {
  id: number;
  nome: string;
  // Adicione outras propriedades do bairro se sua API retornar mais (ex: sigla, etc.)
}

export class CepApiOut extends BaseResourceModel {
    constructor(
      public override id?: number, 
      public cep?: string,
      public tipoEndereco?: number,
      public principal?: string,
      public tipoLogradouroId?: number,
      public tipoLogradouro?: string,
      public logradouroId?: number,
      public logradouroNome?: string,        
      public distritoNome?: string, 
      public cidadeNome?: string,
      public uf?: string,
      public bairros?: Bairro[] // Array de objetos Bairro
    ) {
      super();
      // Inicializar o array para evitar undefined errors, se preferir
       this.bairros = bairros || [];
  }

  static fromJson(jsonData: any): CepApiOut { 
    const instance = new CepApiOut(); 
    
    // Mapeia as propriedades conhecidas e o array 'bairros'
    instance.id             = jsonData.id;
    instance.cep            = jsonData.cep;
    instance.tipoEndereco   = jsonData.tipoEndereco;
    instance.principal      = jsonData.principal;
    instance.tipoLogradouro = jsonData.tipoLogradouro;
    instance.logradouroId   = jsonData.logradouroId;
    instance.logradouroNome = jsonData.logradouroNome;
    instance.distritoNome   = jsonData.distritoNome;
    instance.cidadeNome     = jsonData.cidadeNome;
    instance.uf             = jsonData.uf;

    // Mapeamento cuidadoso do array de bairros
    if (jsonData.bairros && Array.isArray(jsonData.bairros)) {
      instance.bairros = jsonData.bairros.map((bairroData: any) => ({ // Tipar bairroData se possível
        id: bairroData.id,
        nome: bairroData.nome
        
      }));
    } else {
      instance.bairros = []; 
    }

    return instance;
 }

  static toJson(instance: CepApiOut): any {
      return {
        id:             instance.id,
        cep:            instance.cep,
        tipoEndereco:   instance.tipoEndereco,
        principal:      instance.principal,
        tipoLogradouro: instance.tipoLogradouro,
        logradouroId  : instance.logradouroId,
        logradouroNome: instance.logradouroNome,
        distritoNome:   instance.distritoNome,
        cidadeNome:     instance.cidadeNome,
        uf:             instance.uf,
        bairros:        instance.bairros 
    };
  }
}