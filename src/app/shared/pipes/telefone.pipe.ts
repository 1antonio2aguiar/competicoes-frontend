import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

    /**
     * Formata um número de telefone se o tipo de contato for telefônico.
     * Caso contrário, retorna o valor original (ex: para e-mail, site).
     *
     * @param value O valor do contato (o número, e-mail, etc.).
     * @param tipoContato O código numérico do tipo de contato (0, 1, 2, 3, 4, 5).
     */
    transform(value: string | number | null | undefined, tipoContato: number | null | undefined): string {
        // Se não houver valor, retorna uma string vazia.
        if (value === null || value === undefined) {
            return '';
        }

        // Converte o valor para string para garantir a manipulação.
        const valorComoString = String(value);

        // Lista dos códigos que representam um telefone e devem ser formatados.
        const tiposDeTelefone = [0, 1, 2, 5]; // TELEFONE_FIXO, CELULAR, WHATSUP, RECADO

        // VERIFICAÇÃO PRINCIPAL: Se o tipo não é um telefone, retorna o valor original.
        if (tipoContato === null || tipoContato === undefined || !tiposDeTelefone.includes(tipoContato)) {
            return valorComoString;
        }

        // Se chegou aqui, é um telefone. Vamos formatar.
        const apenasDigitos = valorComoString.replace(/\D/g, '');

        // Define se é Celular ('C') ou Fixo ('F') com base no código do enum.
        // Celular/WhatsApp (11 dígitos) vs Fixo/Recado (10 dígitos).
        const tipoMascara = (tipoContato === 1 || tipoContato === 2) ? 'C' : 'F';

        if (tipoMascara === 'C' && apenasDigitos.length === 11) {
            // Formato: (99) 99999-9999
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`;
        }
        
        if (tipoMascara === 'F' && apenasDigitos.length === 10) {
            // Formato: (99) 9999-9999
            return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`;
        }

        // Se o número de dígitos não corresponder, retorna apenas os dígitos para não quebrar.
        return apenasDigitos;
    }
}