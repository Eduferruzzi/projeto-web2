import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CepService, RegistroService } from '../../services'
import { CpfValido } from '../../shared'
import { NgForm } from '@angular/forms'
import { NgxMaskDirective } from 'ngx-mask'
import { Router, RouterLink } from '@angular/router'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'app-user-auto-register',
  imports: [FormsModule, NgxMaskDirective, RouterLink, CpfValido],
  templateUrl: './user-auto-register.html',
  styleUrl: './user-auto-register.css',
})
export class UserAutoRegister {
  nome = '';
  CPF = '';
  email = '';
  telefone = '';

  CEP = '';
  logradouro = signal('');
  numero = '';
  complemento = '';
  bairro = signal('');
  cidade = signal('');
  estado = signal('');

  maiusculo = (valor: unknown): string => String(valor ?? '').toUpperCase();

  mensagemSucesso = signal('');
  mensagemErro = signal('');
  cadastrando = signal(false);

  private cepService = inject(CepService); //injetando o cepservice;
  private registroService = inject(RegistroService);
  private router = inject(Router);

  buscarCep() {
    this.cepService.buscarCep(this.CEP).subscribe(resposta => {
      this.logradouro.set(resposta.logradouro);
      this.bairro.set(resposta.bairro);
      this.cidade.set(resposta.localidade);
      this.estado.set(resposta.uf);
    });
  }

  verificarCep() {
    if (this.CEP.length >= 8) {
      this.buscarCep();
    }
  }

  cadastrar(form: NgForm) {
    this.mensagemErro.set('');
    this.mensagemSucesso.set('');
    if (form.invalid) {
      return;
    }

    this.cadastrando.set(true);
    const usuario = {
        cpf: this.CPF,
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        cep: this.CEP,
        logradouro: this.logradouro(),
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro(),
        cidade: this.cidade(),
        estado: this.estado()
    };

    this.registroService.registrar(usuario).pipe(
      catchError((error: { status?: number; error?: { mensagem?: string } }) => {
        this.mensagemErro.set(error.status === 409
          ? (error.error?.mensagem ?? 'E-mail ou CPF já cadastrado.')
          : 'Não foi possível realizar o cadastro. Tente novamente.');
        this.cadastrando.set(false);
        return of(null);
      })
    ).subscribe(resposta => {
      if (!resposta) {
        return;
      }
      this.mensagemSucesso.set('Cadastro realizado! Confira sua senha de 4 dígitos no e-mail.');
      this.cadastrando.set(false);
      form.resetForm();
      setTimeout(() => this.router.navigate(['/login']), 1000);
    });
  }

}
