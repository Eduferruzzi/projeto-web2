import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Usuario, Login } from '../shared/models';
import {
  clearAuthenticatedUser,
  readAuthenticatedUser,
  storeAuthenticatedUser
} from '../auth/auth-session';

const API_URL = 'http://localhost:8080/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public get usuarioLogado(): Usuario | null {
    return readAuthenticatedUser();
  }

  public set usuarioLogado(usuario: Usuario | null) {
    if (usuario) {
      storeAuthenticatedUser(usuario);
    } else {
      clearAuthenticatedUser();
    }
  }

  logout(): void {
    clearAuthenticatedUser();
  }

  private http = inject(HttpClient);

  login(login: Login): Observable<Usuario | null> {
    return this.http
      .post<Usuario>(API_URL, login, { observe: 'response', withCredentials: true })
      .pipe(
        map((resp: HttpResponse<Usuario>) => (resp.status === 200 ? resp.body : null)),
        catchError(() => of(null))
      );
  }
}
