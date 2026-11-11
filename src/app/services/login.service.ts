import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError, timeout } from 'rxjs';
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

  logout(): Observable<void> {
    return this.http.post<void>('http://localhost:8080/logout', {}, {withCredentials: true})
    .pipe (
      tap(() => {clearAuthenticatedUser();})
    );
  };

  private http = inject(HttpClient);

  consultarSessao(): Observable<Usuario | null> {
    return this.http.get<Usuario>('http://localhost:8080/sessao', { withCredentials: true }).pipe(
      timeout(10000),
      tap(usuario => { this.usuarioLogado = usuario; }),
      catchError(error => {
        if (error.status === 401) {
          this.usuarioLogado = null;
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }

  login(login: Login): Observable<Usuario | null> {
    return this.http
      .post<Usuario>(API_URL, login, { observe: 'response', withCredentials: true })
      .pipe(
        map((resp: HttpResponse<Usuario>) => (resp.status === 200 ? resp.body : null)),
        catchError(error => error.status === 401 ? of(null) : throwError(() => error))
      );
  }
}
