import { Routes } from '@angular/router';
import { UserAutoRegister } from './pages/user-auto-register/user-auto-register';
import { Login } from './pages/login/login';
import { CRUDemployee } from './pages/crudemployee/crudemployee';
import { UserHome } from './pages/user-home/user-home'

export const routes: Routes = [
    {
        path: 'user-auto-register',
        component: UserAutoRegister,
        data: { showNavbar: false }
    },
    {
        path: 'login',
        component: Login,
        data: { showNavbar: false }
    },
    {
        path: 'crud-employee',
        component: CRUDemployee,
        data: { showNavbar: true }
    },
    {
        path: 'user-home',
        component: UserHome,
        data: { showNavbar: true }
    }
];
