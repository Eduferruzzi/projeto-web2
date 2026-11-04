import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services';
import { Login as LoginModel } from '../../shared/models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  @ViewChild('formLogin') formLogin! : NgForm;
  login: LoginModel = new LoginModel();
  loading = signal(false);
  message = signal('');

  private router = inject(Router);
  private loginService = inject(LoginService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (this.loginService.usuarioLogado) {
      let usu = this.loginService.usuarioLogado;
      if (usu.perfil === 'FUNCIONARIO') {
        this.router.navigate(['/employee-home']);
      } else {
        this.router.navigate(['/user-home']);
      }
    } else {
      this.route.queryParams.subscribe(params => {
        if(params['error']) {
          this.message.set(params['error']);
        }
      });
    }
  }

  fecharMensagem(): void {
    this.message.set('');
  }

  fazerLogin(): void {
    if (this.formLogin.form.valid) {
      this.loading.set(true);
      this.message.set('');
      this.loginService.login(this.login).subscribe((usu) => {
        if (usu != null) {
          this.loginService.usuarioLogado = usu;
          this.loading.set(false);
          if (usu.perfil === 'FUNCIONARIO') {
            this.router.navigate(['/employee-home']);
          } else {
            this.router.navigate(['/user-home']);
          }
        } else {
          this.loading.set(false);
          this.message.set("E-mail ou senha incorretos.");
        }
      });
    }
  }

  esqueciSenha(event: Event): void {
    event.preventDefault();
    alert('Um e-mail com as instruções para redefinição de senha foi enviado.');
  }
}
