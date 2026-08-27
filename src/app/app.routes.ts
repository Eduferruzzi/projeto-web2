import { Routes } from '@angular/router'
import { UserAutoRegister } from './pages/user-auto-register/user-auto-register'
import { Login } from './pages/login/login'
import { CRUDemployee } from './pages/crudemployee/crudemployee'
import { CustomerHome } from './pages/customer-home/customer-home'
import { Payment } from './pages/payment/payment'

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
        component: CustomerHome,
    },
    {
        path: 'payment',
        component: Payment,
    }
];
