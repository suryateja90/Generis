import { AppRoute } from 'src/app/models/app-route.model';

export default [
    { path: 'crud', loadComponent: () => import('./crud/crud.component').then(m => m.CrudComponent) },
    { path: 'empty', loadComponent: () => import('./empty/emptydemo.component').then(m => m.EmptyDemoComponent) },
    { path: 'timeline', loadComponent: () => import('./timeline/timelinedemo.component').then(m => m.TimelineDemoComponent) },
    { path: '**', redirectTo: '/notfound' }
] satisfies AppRoute[];