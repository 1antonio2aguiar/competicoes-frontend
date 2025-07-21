import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-resultado-editor',
  // Mantém o template simples com o input
  template: `
     <input #resultadoInput 
           nbInput
           fullWidth
           fieldSize="small"
           [(ngModel)]="inputValue"
           (ngModelChange)="onValueChange($event)"
           (focus)="onFocus()"
           (blur)="onBlur()"
           (click)="onClick()"
           autocomplete="off"
           placeholder="HH:mm:ss:SSS"
           maxlength="12"> 
           
  `, // <<< Adicionado #resultadoInput
  styles: [ /* ... estilos anteriores ... */ ]
})

export class ResultadoEditorComponent implements OnInit {

  @Input() value: string | number; // Recebe o valor inicial da célula da tabela
  @Input() rowData: any;         // Recebe os dados completos da linha (pode ser útil depois)

  
  // <<< ADICIONAR: Evento para notificar o pai quando a edição for 'concluída'
  @Output() valueCommit = new EventEmitter<{ value: string | null, rowData: any }>();
  @ViewChild('resultadoInput') resultadoInputElementRef: ElementRef<HTMLInputElement>;
  
  inputValue: string = ''; // Variável interna para o [(ngModel)] do input
  private originalValue: string = ''; // Guarda o valor original ao focar

  constructor() {
    // Construtor vazio por enquanto, sem injeções
  }

  ngOnInit(): void {
    this.inputValue = this.formatDisplayValue(this.value); // Formata o valor inicial também
    this.originalValue = this.inputValue; // Guarda o valor inicial formatado
  }

  onClick(): void {
    if (this.resultadoInputElementRef && this.resultadoInputElementRef.nativeElement) {
       this.resultadoInputElementRef.nativeElement.select();
    } else {
        console.warn('Não foi possível encontrar a referência do input para selecionar.');
    }
  }

  onFocus(): void {
    // Carrega o valor ATUAL da linha (que pode ter sido atualizado por um blur anterior)
    // e o define como o valor inicial PARA ESTA SESSÃO DE FOCO.
    // Usamos this.value que é o @Input vindo da tabela (reflete o último estado do 'source')
    // ou rowData.resultado que pode estar mais atualizado se o 'source' ainda não refletiu um commit anterior.
    // É mais seguro usar this.value, assumindo que o source.update no pai funciona.

    // const valorAtualDaCelula = (this.value !== null && this.value !== undefined) ? String(this.value) : '';
    // OU, se this.value demorar a atualizar via Input, usar rowData diretamente PODE ser uma opção, mas cuidado com a consistência.
    // Vamos manter a sua lógica atual que usa rowData diretamente:
    const valorAtualDaCelula = this.rowData.resultado ?? ''; // Pega o valor atual dos dados da linha
    this.inputValue = valorAtualDaCelula;
    this.originalValue = this.inputValue; // Guarda ESTE valor como referência para o onBlur
    //console.log(`Input focado. Valor original guardado: [${this.originalValue}]`);

    // Selecionar o texto no foco também (além do clique) pode ser útil
     if (this.resultadoInputElementRef && this.resultadoInputElementRef.nativeElement) {
         // Usar setTimeout para garantir que o select ocorra após o Angular atualizar o valor
         setTimeout(() => {
             if (this.resultadoInputElementRef && this.resultadoInputElementRef.nativeElement){
                 this.resultadoInputElementRef.nativeElement.select();
                 //console.log('Texto selecionado no foco.');
             }
         }, 0);
     }
  }

  onValueChange(value: string): void {
    const formattedValue = this.formatInput(value);
    // Atualiza o valor do input SOMENTE se a formatação o modificou
    // Isso evita possíveis loops ou comportamento inesperado
    if (formattedValue !== this.inputValue) {
      this.inputValue = formattedValue;
    }
  }

  formatInput(value: string): string {
    if (!value) {
      return '';
    }

    // 1. Remove tudo exceto dígitos
    let digits = value.replace(/\D/g, '');

    // 2. Limita ao máximo de 9 dígitos (HHmmssSSS)
    digits = digits.slice(0, 9);

    // 3. Aplica a máscara progressivamente
    let maskedValue = '';
    const len = digits.length;

    if (len > 0) { // HH
      maskedValue += digits.slice(0, Math.min(2, len));
    }
    if (len > 2) { // :mm
      maskedValue += ':' + digits.slice(2, Math.min(4, len));
    }
    if (len > 4) { // :ss
      maskedValue += ':' + digits.slice(4, Math.min(6, len));
    }
    if (len > 6) { // :SSS
      maskedValue += ':' + digits.slice(6, Math.min(9, len));
    }

    return maskedValue;
  }

  formatDisplayValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return this.formatInput(String(value)); // Reutiliza a lógica de formatação
  }

  onBlur(): void {
    const finalValue = this.inputValue.trim();
    // Log para depuração, mostrando o valor final e o original (antes do foco/edição)
    //console.log(`Input perdeu foco. Valor final: [${finalValue}], Original antes do foco: [${this.originalValue}]`);

    // --- Condição Principal: O valor mudou? ---
    // Compara o valor final com o valor que estava no campo ANTES do usuário interagir (guardado em originalValue no onFocus)
    if (finalValue !== this.originalValue) {
        // SIM, o valor foi alterado pelo usuário.
        //console.log("Valor foi alterado pelo usuário.");

        // Decide o que emitir com base no valor final:
        if (finalValue.length === 0) {
            // O usuário limpou ativamente um campo que tinha valor.
            //console.log("Campo limpo intencionalmente. Emitindo null.");
            this.valueCommit.emit({ value: null, rowData: this.rowData });
            // Atualiza o originalValue para refletir que agora o valor "comitado" é vazio
            this.originalValue = '';
        } else {
            // O usuário digitou um novo valor (parcial ou completo).
            //console.log(`Novo valor digitado. Emitindo: ${finalValue}`);
            this.valueCommit.emit({ value: finalValue, rowData: this.rowData });
            // Atualiza o originalValue para este novo valor comitado
            this.originalValue = finalValue;
        }
    } else {
        // NÃO, o valor final é igual ao que estava antes.
        // O usuário clicou/tabulou para dentro e para fora sem fazer alterações significativas.
        //console.log("Nenhuma alteração detectada. Não emitindo evento.");
        // Não fazemos nada, o this.valueCommit NÃO é emitido.
        // O valor no input já deve ser o original por causa da lógica do onFocus.
    }
}

}