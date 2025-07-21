import { Directive, ElementRef, HostBinding, HostListener , Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[ngxFullScreenStyle]'
})

export class FullScreenStyleDirective {
    @Input() ngxFullScreenStyle: number; 

    constructor(private el: ElementRef) { }

    @HostBinding('style.width') get widthStyle() {
        return this.ngxFullScreenStyle ? `${this.ngxFullScreenStyle}%` : null;
    }
}

@Directive({
    selector: '[ngxSelectStyle]'
})
export class SelectStyleDirective implements AfterViewInit {
    constructor(private el: ElementRef) { }

    @HostBinding('style.display') get displayStyle() {
        return 'block';
    }

    ngAfterViewInit() {
        this.el.nativeElement.style.display = '';
    }
}

//<algum-elemento [ngxFullScreenStyle]="80">...</algum-elemento>
//<algum-elemento ngxSelectStyle>...</algum-elemento>