import { Service } from '@angular/core';
import { User } from '../models/user';

@Service()
export class UserService {
    private users : User[] = [
        {
            id: 1,
            nome: 'Eduardo',
        },
        {
            id: 2,
            nome: 'Teste',
        },
    ]

    listarTodos() : User[]{
        return this.users
    }

    inserir(user:User) : void {
        user.id = new Date().getTime()
        this.users.push(user)
    }
}
