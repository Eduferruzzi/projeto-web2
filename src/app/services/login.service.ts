import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Usuario, Login } from '../shared/models';

const LS_CHAVE: string = "usuarioLogado";
const API_URL = 'http://localhost:8081/login';

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

  private http = inject(HttpClient);

  login(login: Login): Observable<Usuario | null> {
    return this.http
      .post<Usuario>(API_URL, login, { observe: 'response' })
      .pipe(
        map((resp: HttpResponse<Usuario>) => (resp.status === 200 ? resp.body : null)),
        catchError(() => of(null))
      );
  }
}
