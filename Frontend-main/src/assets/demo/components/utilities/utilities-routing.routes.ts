import { AppRoute } from 'src/app/models/app-route.model';

export default [
    { path: 'icons', data: { breadcrumb: 'Prime Icons' }, loadComponent: () => import('./icons/icons.component').then(m => m.IconsComponent) },
    { path: '**', redirectTo: '/notfound' }
] satisfies AppRoute[];