import { Component, forwardRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-datepicker',
  template: `
    <input type="date" class="custom-datepicker" [formControl]="dateControl" (blur)="onBlur()"/>
  `,
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    }
  ],
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements ControlValueAccessor, OnChanges {
  @Input() value: any;
  @Output() save = new EventEmitter<any>();
  dateControl = new FormControl();
  onChange: any = () => {};
  onTouched: any = () => {};
  dateChange: any;

  constructor(private datePipe: DatePipe){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && this.value !== undefined) {
      this.dateControl.setValue(this.formatDate(this.value), {emitEvent: false});
    } else {
        this.dateControl.setValue(null, {emitEvent: false});
    }
  }

  onBlur() {
    const dateValue = this.dateControl.value;
    let dateArray = JSON.parse(localStorage.getItem('myDateArray') || '[]'); // Obtém o array existente ou cria um novo
    if (!Array.isArray(dateArray)) {
      dateArray = []; // Garante que seja um array, caso algo estranho aconteça
    }
  
    if (dateArray.length === 0) {
      dateArray[0] = dateValue; // Primeira data
    } else if (dateArray.length === 1) {
      dateArray[1] = dateValue; // Segunda data
    } else {
        // Se já tem duas datas, você precisa decidir o que fazer.  
        // Você pode substituir a mais antiga, a mais recente, ou não fazer nada.
        dateArray[1] = dateValue; // Substitui a segunda data (mais recente)
        // Ou:
        // dateArray[0] = dateValue; // Substitui a primeira data (mais antiga)
        // Ou:
        // console.warn("Já existem duas datas armazenadas.");
        // return; // Não faz nada
    }
  
    localStorage.setItem('myDateArray', JSON.stringify(dateArray)); // Salva o array de volta no localStorage
    this.dateChange.emit(dateValue);
  }

  writeValue(value: any): void {
    this.dateControl.setValue(this.formatDate(value), {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  private formatDate(date: any): string | null {
    if (!date) {
      return null;
    }
    try {
      if (typeof date === 'string') {
        const dateObj = new Date(date);
        return this.datePipe.transform(dateObj, 'yyyy-MM-dd');
      }
      return this.datePipe.transform(date, 'yyyy-MM-dd');
    } catch (error) {
      //console.error("Erro ao formatar data", error);
      return null;
    }
  }
}