import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';
  tipoUsuario = 'cliente';

  private router = inject(Router);

  entrar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const rota = this.tipoUsuario === 'trabalhador'
      ? '/employee-home'
      : '/user-home';

    this.router.navigate([rota]);
  }
}
