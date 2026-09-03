import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CepService } from '../../services/user-auto-register/cep-service'
import { NgxMaskDirective } from 'ngx-mask';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-auto-register',
  imports: [FormsModule, NgxMaskDirective],
  templateUrl: './user-auto-register.html',
  styleUrl: './user-auto-register.css',
})
export class UserAutoRegister {
  nome = '';
  CPF = '';
  email = '';
  telefone = '';

  CEP = '';
  logradouro = '';
  numero = '';
  complemento = '';
  bairro = '';
  cidade = '';
  estado = '';

  mensagemSucesso = '';

  private cepService = inject(CepService); //injetando o cepservice;

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
    try {
      if (form.invalid) {
        return;
      }
      const usuario = {
        CPF: this.CPF,
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        CEP: this.CEP,
        logradouro: this.logradouro,
        numero: this.numero,
        complemento: this.complemento,
        bairro: this.bairro,
        cidade: this.cidade,
        estado: this.estado
      };

      const json = JSON.stringify(usuario);
      console.log(json);

      this.mensagemSucesso = 'Cadastro realizado com sucesso!';

      form.resetForm();
    }
    catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      this.mensagemSucesso = 'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.';
    }

  }

}
