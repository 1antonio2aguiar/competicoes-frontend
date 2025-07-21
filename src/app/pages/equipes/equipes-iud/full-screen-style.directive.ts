import { Directive, ElementRef, HostBinding, HostListener , Input } from '@angular/core';

@Directive({
    // Use um seletor que corresponda à classe gerada
    selector: '[appFullScreenStyle][_nghost-omv-c104]'
})

export class FullScreenStyleDirective {
    @Input() width: number; // Recebe a largura desejada

    constructor(private el: ElementRef) { }

    @HostBinding('style.width') get widthStyle() {
        return `${this.width}%`; // Define a largura dinamicamente
    }
}

@Directive({
    selector: '[appSelectStyle][_nghost-*-c98]'
  })

  export class SelectStyleDirective {
    constructor(private el: ElementRef) { }
  
    @HostBinding('style.display') get displayStyle() {
      return 'block';
    }
  
    @HostListener('ngAfterViewInit') ngAfterViewInit() {
      this.el.nativeElement.style.display = ''; 
  }

}