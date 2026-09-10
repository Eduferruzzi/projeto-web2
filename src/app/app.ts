import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('projeto-web2');

  mostrarNavBar = false;

  constructor(private route: Router)
  {
    this.route.events.subscribe(() => {
      const rotaAtual = this.route.routerState.root;

      const rotaFilha = rotaAtual.firstChild;

      this.mostrarNavBar = rotaFilha?.snapshot.data?.['showNavbar'] ?? false;
    })
  }
}
