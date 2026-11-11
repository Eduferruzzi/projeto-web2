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
    const erro = this.route.snapshot.queryParamMap.get('error');
    if (erro) {
      this.message.set(erro);
    }
    this.loading.set(true);
    this.loginService.consultarSessao().subscribe({
      next: usuario => {
        this.loading.set(false);
        if (usuario) {
          this.router.navigate([usuario.perfil === 'FUNCIONARIO' ? '/employee-home' : '/user-home']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.message.set('Nao foi possivel verificar sua sessao. Tente novamente.');
      }
    });
  }

  fecharMensagem(): void {
    this.message.set('');
  }

  fazerLogin(): void {
    if (this.formLogin.form.valid && !this.loading()) {
      this.loading.set(true);
      this.message.set('');
      this.loginService.login(this.login).subscribe({ next: (usu) => {
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
      }, error: () => {
        this.loading.set(false);
        this.message.set('Nao foi possivel conectar ao servidor. Tente novamente.');
      }});
    }
  }
}
