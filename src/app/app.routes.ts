
import { Routes } from '@angular/router'
import { CRUDemployee } from './pages/crudemployee'
import { CustomerHome } from './pages/customer-home'
import { EmployeeHome } from './pages/employee-home'
import { ExecuteMaintenance } from './pages/execute-maintenance'
import { Login } from './pages/login'
import { MaintenanceRequest } from './pages/maintenance-request'
import { Payment } from './pages/payment'
import { Quote } from './pages/quote'
import { ServiceDetails } from './pages/service-details'
import { UserAutoRegister } from './pages/user-auto-register'
import { Budget } from './pages/budget'


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
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
        component: CustomerHome,
        data: { showNavbar: true }
    },
    {
        path: 'payment/:id',
        component: Payment,
        data: { showNavbar: true }
    },
    {
        path: 'maintenance-request',
        component: MaintenanceRequest,
        data: { showNavbar: true }
    },
    {
        path: 'service/:id',
        component: ServiceDetails,
        data: { showNavbar: true }
    },
    {
        path: 'quote/:id',
        component: Quote,
        data: { showNavbar: true }
    },
    {
        path: 'employee-home',
        component: EmployeeHome,
        data: { showNavbar: true }
    },
    {
        path: 'execute-maintenance',
        component: ExecuteMaintenance,
        data: { showNavbar: true }
    },
    {
        path: 'budgettemp/:id',
        component: Budget,
        data: { showNavbar: true }
    }
];
