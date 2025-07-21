import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root' // Isso torna o serviço disponível globalmente
})
export class FormatarTempoService {

  formatarTempo(valor: string): string {
    // Remove todos os caracteres não numéricos
    valor = valor.replace(/[^0-9]/g, '');

    // Aplica a máscara
    if (valor.length > 0) {
      if (valor.length > 2) {
        valor = valor.substring(0, 2) + ':' + valor.substring(2);
      }
      if (valor.length > 5) {
        valor = valor.substring(0, 5) + ':' + valor.substring(5);
      }
      if (valor.length > 8) {
        valor = valor.substring(0, 8) + ':' + valor.substring(8, 11);
      }
      if (valor.length > 12) {
        valor = valor.substring(0, 12); // Limita o tamanho
      }
    }

    return valor;
  }

  atualizarFormControl(control: AbstractControl | null, valor: string): void {
    if (control) {
      control.setValue(valor, { emitEvent: false });
    }
  }
}
