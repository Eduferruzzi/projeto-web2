
import { Routes } from '@angular/router'
import { CRUDemployee } from './pages/employee-crud'
import { CustomerHome } from './pages/customer-home'
import { EmployeeHome } from './pages/employee-home'
import { ExecuteMaintenance } from './pages/execute-maintenance'
import { Login } from './pages/login'
import { MaintenanceRequest } from './pages/maintenance-request'
import { Payment } from './pages/payment'
import { Quote } from './pages/quote'
import { ServiceDetails } from './pages/service-details'
import { UserAutoRegister } from './pages/user-auto-register'
import { Budget } from './pages/employee-quote'
import { CreateCategories, EditCategories, ListCategories } from './pages/category-crud'
import { EmployeeRequests } from './pages/employee-requests'
import { Reports } from './pages/reports'

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
        path: 'employee-crud',
        component: CRUDemployee,
        data: { showEmployeeNavbar: true }
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
        data: { showEmployeeNavbar: true }
    },
    {
        path: 'execute-maintenance/:id',
        component: ExecuteMaintenance,
        data: { showEmployeeNavbar: true }
    },
    {
        path: 'employee-quote/:id',
        component: Budget,
        data: { showNavbar: true }
    },
    {
        path: 'categories',
        component: ListCategories,
        data: { showEmployeeNavbar: true }
    },
    {
        path: 'categories/new',
        component: CreateCategories,
        data: { showNavbar: true }
    },
    {
        path: 'categories/edit/:id',
        component: EditCategories,
        data: { showNavbar: true }
    },
    {
        path: 'reports',
        component: Reports,
        data: { showEmployeeNavbar: true }
    },
    {
        path: 'employee-requests',
        component: EmployeeRequests,
        data: { showEmployeeNavbar: true }
    }
];
