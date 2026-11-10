import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';

export interface FuncionarioInput {
  nome: string;
  email: string;
  dataNascimento: string;
  senha: string;
}

const API_URL = 'http://localhost:8080/funcionarios';
const AUTH_OPTIONS = { withCredentials: true, credentials: 'include' as const };

interface FuncionarioApi {
  id: number;
  dataNascimento: string;
  usuario: {
    nome: string;
    email: string;
  };
}

interface FuncionarioRequest {
  dataNascimento: string;
  usuario: {
    nome: string;
    email: string;
    senha: string;
  };
}

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);

  listar(): Observable<User[]> {
    return this.http.get<FuncionarioApi[]>(API_URL, AUTH_OPTIONS).pipe(
      map(funcionarios => funcionarios.map(funcionario => this.paraUser(funcionario)))
    );
  }

  criar(funcionario: FuncionarioInput): Observable<User> {
    return this.http.post<FuncionarioApi>(API_URL, this.paraRequest(funcionario), AUTH_OPTIONS).pipe(
      map(resposta => this.paraUser(resposta))
    );
  }

  atualizar(id: number, funcionario: FuncionarioInput): Observable<User> {
    return this.http.put<FuncionarioApi>(`${API_URL}/${id}`, this.paraRequest(funcionario), AUTH_OPTIONS).pipe(
      map(resposta => this.paraUser(resposta))
    );
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`, { withCredentials: true, credentials: 'include' });
  }

  private paraRequest(funcionario: FuncionarioInput): FuncionarioRequest {
    return {
      dataNascimento: funcionario.dataNascimento,
      usuario: {
        nome: funcionario.nome,
        email: funcionario.email,
        senha: funcionario.senha
      }
    };
  }

  private paraUser(funcionario: FuncionarioApi): User {
    return new User(
      funcionario.id,
      funcionario.usuario.nome,
      funcionario.usuario.email,
      funcionario.dataNascimento
    );
  }

  buscarPorId(id: number): Observable<User> {
    return this.http.get<FuncionarioApi>(`${API_URL}/${id}`, AUTH_OPTIONS).pipe(
      map(funcionario => this.paraUser(funcionario))
    );
  }
}
