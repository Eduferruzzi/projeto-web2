import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    private users: User[] = [
        {
            id: 1,
            nome: 'Eduardo',
            email: 'eduardo@mock.local',
            dataNascimento: '1990-01-12',
            senha: '1234'
        },
        {
            id: 2,
            nome: 'Teste',
            email: 'teste@mock.local',
            dataNascimento: '1995-02-03',
            senha: '1234'
        },
    ];

    listarTodos(): User[] {
        return this.users;
    }

    buscarPorId(id: number): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    inserir(user: User): void {
        user.id = new Date().getTime();
        this.users.push(user);
    }

    atualizar(user: User): void {
        const atual = this.buscarPorId(user.id);
        if (!atual) {
            return;
        }

        Object.assign(atual, user);
    }

    remover(id: number): void {
        this.users = this.users.filter((user) => user.id !== id);
    }
}
