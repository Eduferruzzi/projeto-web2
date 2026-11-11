import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';

const API_URL = 'http://localhost:8080/funcionarios';
const AUTH_OPTIONS = { withCredentials: true };

interface FuncionarioAPI {
    id: number;
    dataNascimento: string;
    usuario: {
        nome: string;
        email: string;
    };
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);

    listarTodos(): Observable<User[]> {
        return this.http.get<FuncionarioAPI[]>(API_URL, AUTH_OPTIONS).pipe(
            map(funcionarios => funcionarios.map(funcionario => this.paraUser(funcionario)))
        );
    }

    buscarPorId(id: number): Observable<User> {
        return this.http.get<FuncionarioAPI>(`${API_URL}/${id}`, AUTH_OPTIONS).pipe(
            map(funcionario => this.paraUser(funcionario))
        );
    }

    private paraUser(funcionario: FuncionarioAPI): User {
        return new User(
            funcionario.id,
            funcionario.usuario.nome,
            funcionario.usuario.email,
            funcionario.dataNascimento
        );
    }
}
