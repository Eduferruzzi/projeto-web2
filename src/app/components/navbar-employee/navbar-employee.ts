import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-employee',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-employee.html',
  styleUrl: './navbar-employee.css',
})
export class NavbarEmployee {}
