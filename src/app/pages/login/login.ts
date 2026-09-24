import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Numerico } from '../../shared/directives/numerico';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, Numerico],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);

  
  // fazerLogin(email: string, senha: string, tipoUsuario: string): void {
  //   // valida a senha
  //   const senhaValida = /^\d{4}$/.test(senha);
  //   if (!senhaValida) {
  //     alert('A senha deve conter exatamente 4 números.');
  //     return;
  //   }

  //   // valida o email
  //   const emailValido = /^[^\s@]+@[^\s@]+$/.test(email);
  //   if (!emailValido) {
  //     alert('Por favor, insira um e-mail válido.');
  //     return;
  //   }

  //   // redireciona com base no tipo de usuario da radiobox
  //   if (tipoUsuario === 'cliente') {
  //     this.router.navigate(['/user-home']);
  //   } else {
  //     this.router.navigate(['/employee-home']);
  //   }
  // }

  fazerLogin(email: string, senha: string): void {
    // valida a senha
    const senhaValida = /^\d{4}$/.test(senha);
    if (!senhaValida) {
      alert('A senha deve conter exatamente 4 números.');
      return;
    }

    // valida o email
    const emailValido = /^[^\s@]+@[^\s@]+$/.test(email);
    if (!emailValido) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    // redireciona com base no tipo de usuario da radiobox
    if (email === 'cliente@gmail.com' && senha === '1234') {
      this.router.navigate(['/user-home']);
    } else if(email === 'funcionario@gmail.com' && senha === '4321'){
      this.router.navigate(['/employee-home']);
    }
    else{
      alert('Email ou senha incorretos');
    }
  }

  // alerta simples
  esqueciSenha(event: Event): void {
    event.preventDefault();
    alert('Um e-mail com as instruções para redefinição de senha foi enviado.');
  }
}