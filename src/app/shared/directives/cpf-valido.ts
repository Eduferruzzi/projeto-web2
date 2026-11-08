import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export function cpfValido(valor: string | null | undefined): boolean {
  const cpf = (valor ?? '').replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const digitoVerificador = (tamanho: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    return ((soma * 10) % 11) % 10;
  };

  return digitoVerificador(9) === Number(cpf[9]) && digitoVerificador(10) === Number(cpf[10]);
}

@Directive({
  selector: '[cpfValido]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CpfValido, multi: true }],
})
export class CpfValido implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    // n precisa verificar campo vazio pq ta no required
    if (!control.value) {
      return null;
    }
    if (cpfValido(control.value)) {
      return null;
    }
    return { cpfInvalido: true };
  }
}
