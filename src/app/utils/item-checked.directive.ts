import { Directive, ElementRef, HostListener, Input, OnInit, SimpleChanges } from "@angular/core";

@Directive({
    standalone: true,
    selector: '[appItemChecked]',
})
export class ItemCheckedDirective {
    @Input() appItemChecked:boolean = false;
    @HostListener('change') ngOnChanges() {
        // console.log(this.appItemChecked)
        if(this.appItemChecked === true){
            this.element.nativeElement.style.opacity=0.7;

        }else {
            this.element.nativeElement.style.opacity=1;
        }

    }
    constructor(private element: ElementRef) {

      }
}