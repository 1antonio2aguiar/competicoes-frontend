import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempoFormatado'
})

export class TempoFormatadoPipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (!value) {
      return '00:00:00:000'; // Valor padrão
    }

    const valorString = String(value).padStart(9, '0');
    return valorString.replace(/(\d{2})(\d{2})(\d{2})(\d{3})/, '$1:$2:$3:$4'); // Formata com regex
  }
}
