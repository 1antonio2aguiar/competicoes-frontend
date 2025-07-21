import { Directive, ElementRef, HostBinding, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[ngxFullScreenStyle]' 
})

export class FullScreenStyleDirective {
    // ... o resto da diretiva está ok
    @Input() width: number;
    constructor(private el: ElementRef) { }
    @HostBinding('style.width') get widthStyle() {
        return `${this.width}%`;
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