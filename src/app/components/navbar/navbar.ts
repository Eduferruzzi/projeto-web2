import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services';
import { Usuario } from '../../shared/models';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  menuAberto = false;

  get usuarioLogado(): Usuario | null {
    return this.loginService.usuarioLogado;
  }

  get ehFuncionario(): boolean {
    return this.usuarioLogado?.perfil === 'FUNCIONARIO';
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
    },
      error: (error) => {
      alert('Erro ao fazer logout: ' + error.message);
    }
    });
  } 

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }
}
