import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Numerico } from '../../shared';
import { LoginService } from '../../services';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, Numerico],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private loginService = inject(LoginService);

  
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

    this.loginService.login(email, senha).subscribe(usuario => {
      if (!usuario) {
        alert('Email ou senha incorretos');
        return;
      }

      this.loginService.usuarioLogado = usuario;

      const paginaInicial = usuario.perfil === 'FUNCIONARIO'
        ? '/employee-home'
        : '/user-home';

      this.router.navigate([paginaInicial]);
    });
  }

  // alerta simples
  esqueciSenha(event: Event): void {
    event.preventDefault();
    alert('Um e-mail com as instruções para redefinição de senha foi enviado.');
  }
}
