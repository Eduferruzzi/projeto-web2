import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services';

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

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
