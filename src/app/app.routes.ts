import { Routes } from '@angular/router';
import { UserAutoRegister } from './user-auto-register/user-auto-register';
import { Login } from './login/login';

export const routes: Routes = [
    {
        path: 'user-auto-register',
        component: UserAutoRegister,
    },
    {
        path: 'login',
        component: Login,
    }
];
