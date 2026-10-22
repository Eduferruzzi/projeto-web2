import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CepService, RegistroService } from '../../services'
import { NgForm } from '@angular/forms'
import { NgxMaskDirective } from 'ngx-mask'
import { Router, RouterLink } from '@angular/router'
import { catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'app-user-auto-register',
  imports: [FormsModule, NgxMaskDirective, RouterLink],
  templateUrl: './user-auto-register.html',
  styleUrl: './user-auto-register.css',
})
export class UserAutoRegister {
  nome = '';
  CPF = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  telefone = '';

  CEP = '';
  logradouro = '';
  numero = '';
  complemento = '';
  bairro = '';
  cidade = '';
  estado = '';

  mensagemSucesso = '';
  mensagemErro = '';
  cadastrando = false;

  private cepService = inject(CepService); //injetando o cepservice;
  private registroService = inject(RegistroService);
  private router = inject(Router);

  buscarCep() {
    this.cepService.buscarCep(this.CEP).subscribe(resposta => {
      this.logradouro = resposta.logradouro;
      this.bairro = resposta.bairro;
      this.cidade = resposta.localidade;
      this.estado = resposta.estado;
    });
  }

  verificarCep() {
    if (this.CEP.length >= 8) {
      this.buscarCep();
    }
  }

  cadastrar(form: NgForm) {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    if (form.invalid || this.senha !== this.confirmarSenha) {
      if (this.senha !== this.confirmarSenha) {
        this.mensagemErro = 'As senhas não coincidem.';
      }
      return;
    }

    this.cadastrando = true;
    const usuario = {
        cpf: this.CPF,
        nome: this.nome,
        email: this.email,
        senha: this.senha,
        telefone: this.telefone,
        cep: this.CEP,
        logradouro: this.logradouro,
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro,
        cidade: this.cidade,
        estado: this.estado
    };

    this.registroService.registrar(usuario).pipe(
      catchError((error: { status?: number; error?: { mensagem?: string } }) => {
        this.mensagemErro = error.status === 409
          ? (error.error?.mensagem ?? 'E-mail ou CPF já cadastrado.')
          : 'Não foi possível realizar o cadastro. Tente novamente.';
        this.cadastrando = false;
        return of(null);
      })
    ).subscribe(resposta => {
      if (!resposta) {
        return;
      }
      this.mensagemSucesso = 'Cadastro realizado com sucesso!';
      this.cadastrando = false;
      form.resetForm();
      setTimeout(() => this.router.navigate(['/login']), 1000);
    });
  }

}
