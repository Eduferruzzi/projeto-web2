import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CepService } from '../services/cep-service'

@Component({
  selector: 'app-user-auto-register',
  imports: [FormsModule],
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
    if(this.CEP.length >=8)
    {
      this.buscarCep();
    }
  }
}
