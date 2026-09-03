
import { Routes } from '@angular/router'
import { CRUDemployee } from './pages/crudemployee'
import { CustomerHome } from './pages/customer-home'
import { EmployeeHome } from './pages/employee-home'
import { ExecuteMaintenance } from './pages/execute-maintenance'
import { Login } from './pages/login'
import { MaintenanceRequest } from './pages/maintenance-request'
import { Payment } from './pages/payment'
import { Quote } from './pages/quote'
import { UserAutoRegister } from './pages/user-auto-register'


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
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
    },
    {
        path: 'maintenance-request',
        component: MaintenanceRequest,
    },
    {
        path: 'quote/:id',
        component: Quote,
    },
    {
        path: 'employee-home',
        component: EmployeeHome,
    },
    {
        path: 'execute-maintenance',
        component: ExecuteMaintenance,
    }
];
