import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario, Login } from '../shared/models';

const LS_CHAVE: string = "usuarioLogado";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public get usuarioLogado(): Usuario | null {
    const usuario = localStorage.getItem(LS_CHAVE);
    return usuario ? JSON.parse(usuario) : null;
  }

  public set usuarioLogado(usuario: Usuario | null) {
    if (usuario) {
      localStorage.setItem(LS_CHAVE, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(LS_CHAVE);
    }
  }

  logout(): void {
    localStorage.removeItem(LS_CHAVE);
  }

  login(login: Login): Observable<Usuario | null> {
    if (login.login === 'cliente@gmail.com' && login.senha === '1234') {
      return of(new Usuario(1, 'Cliente', login.login, login.senha, 'CLIENTE'));
    }

    if (login.login === 'funcionario@gmail.com' && login.senha === '4321') {
      return of(new Usuario(2, 'Funcionário', login.login, login.senha, 'FUNCIONARIO'));
    }

    return of(null);
  }
}
