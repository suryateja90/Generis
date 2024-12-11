import { AppRoute } from 'src/app/models/app-route.model';

export default [
    {
        path: '', loadComponent: () => import('./menus.component').then(m => m.MenusComponent),
        children:
            [
                { path: '', redirectTo: 'personal', pathMatch: 'full' },
                { path: 'personal', loadComponent: () => import('./personal.component').then(m => m.PersonalComponent) },
                { path: 'confirmation', loadComponent: () => import('./confirmation.component').then(m => m.ConfirmationComponent) },
                { path: 'seat', loadComponent: () => import('./seat.component').then(m => m.SeatComponent) },
                { path: 'payment', loadComponent: () => import('./payment.component').then(m => m.PaymentComponent) }
            ]
    }
] satisfies AppRoute[];