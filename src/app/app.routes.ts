
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
    },
    {
        path: 'maintenance-request',
        component: MaintenanceRequest,
    },
    {
        path: 'service/:id',
        component: ServiceDetails,
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
    },
    {
        path: 'budgettemp/:id',
        component: Budget,
    }
];
