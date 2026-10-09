import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';

const LS_CHAVE = 'usuarioLogado';

@Injectable({ providedIn: 'root' })
export class LoginService {
  get usuarioLogado(): Usuario | null {
    const usuario = localStorage.getItem(LS_CHAVE);
    return usuario ? JSON.parse(usuario) : null;
  }

  set usuarioLogado(usuario: Usuario) {
    localStorage.setItem(LS_CHAVE, JSON.stringify(usuario));
  }

  login(email: string, senha: string): Observable<Usuario | null> {
    if (email === 'cliente@gmail.com' && senha === '1234') {
      return of(new Usuario(1, 'Cliente', email, 'CLIENTE'));
    }

    if (email === 'funcionario@gmail.com' && senha === '4321') {
      return of(new Usuario(2, 'Funcionário', email, 'FUNCIONARIO'));
    }

    return of(null);
  }

  logout(): void {
    localStorage.removeItem(LS_CHAVE);
  }
}
