import { Pipe, PipeTransform } from '@angular/core';
import { formatarMoedaBr } from '../shared';

// Permite formatar o valor direto no template: {{ valor | moedaBr }}
@Pipe({
  name: 'moedaBr',
})
export class MoedaBrPipe implements PipeTransform {
  transform(valor : number | null) : string {
    return formatarMoedaBr(valor);
  }
}
