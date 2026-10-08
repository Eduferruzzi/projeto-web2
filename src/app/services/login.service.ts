import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario, Login } from '../shared/models';

const LS_CHAVE: string = "usuarioLogado";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public get usuarioLogado(): Usuario {
    let usu = localStorage[LS_CHAVE];
    return (usu ? JSON.parse(localStorage[LS_CHAVE]) : null);
  }

  public set usuarioLogado(usuario: Usuario) {
    localStorage[LS_CHAVE] = JSON.stringify(usuario);
  }

  logout() {
    delete localStorage[LS_CHAVE];
  }

  login(login: Login): Observable<Usuario | null> {
    let usu = new Usuario(1, "Usuário", login.login, login.senha, "CLIENTE");

    if (login.login === 'cliente@gmail.com' && login.senha === '1234') {
      usu.perfil = "CLIENTE";
      return of(usu);
    } 
    else if (login.login === 'funcionario@gmail.com' && login.senha === '4321') {
      usu.perfil = "FUNCIONARIO";
      return of(usu);
    }
    else {
      return of(null);
    }
  }
}

