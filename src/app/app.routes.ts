import { Routes } from '@angular/router';
import { UserAutoRegister } from './pages/user-auto-register/user-auto-register';
import { Login } from './pages/login/login';
import { CRUDemployee } from './pages/crudemployee/crudemployee';
import { UserHome } from './pages/user-home/user-home'

export const routes: Routes = [
    {
        path: 'user-auto-register',
        component: UserAutoRegister,
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'crud-employee',
        component: CRUDemployee,
    },
    {
        path: 'user-home',
        component: UserHome,
    }
];
