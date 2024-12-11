import { AppRoute } from 'src/app/models/app-route.model';

export default [
    { path: '', loadComponent: () => import('./reporting.component').then(m => m.ReportComponent) },
    { path: ':reportId', loadComponent: () => import('./reporting.component').then(m => m.ReportComponent) },
] satisfies AppRoute[];