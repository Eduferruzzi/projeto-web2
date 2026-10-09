import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services';
import { Usuario } from '../../shared/models';

@Component({
  selector: 'app-navbar-employee',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-employee.html',
  styleUrl: './navbar-employee.css',
})
export class NavbarEmployee {
  private loginService = inject(LoginService);
  private router = inject(Router);

  menuAberto = false;

  private loginService = inject(LoginService);
  private router = inject(Router);

  get usuarioLogado(): Usuario | null {
    return this.loginService.usuarioLogado;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
