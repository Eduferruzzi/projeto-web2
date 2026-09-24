import { Directive, ElementRef, Host, HostListener } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms'

@Directive({
  selector: '[numerico]',
})
export class Numerico implements ControlValueAccessor{
  onChange: any = () => {}
  onTouched: any = () => {}

  constructor(private el:ElementRef){}
  registerOnChange(fn: any): void {
    this.onChange = fn  
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(valor: any): void {
    this.el.nativeElement.value = valor
  }

  @HostListener('keyup', ['$event'])
  onKeyUp($event:any){
    let valor = $event.target.value

    // expressão regular: remove tudo que não é número
    valor = valor.replace(/[\D]/g, '')

    $event.target.value = valor

    this.onChange(valor)
  }
}
