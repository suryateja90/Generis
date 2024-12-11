import { AppRoute } from '../models/app-route.model';

export default [
    { path: 'error', loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent) },
    { path: 'access', loadComponent: () => import('./components/access/access.component').then(m => m.AccessComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    { path: 'confirm-email', loadComponent: () => import('./components/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent) },
    { path: 'password-forgot', loadComponent: () => import('./components/password-forgot/password-forgot.component').then(m => m.PasswordForgotComponent) },
    { path: 'password-reset', loadComponent: () => import('./components/password-reset/password-reset.component').then(m => m.PasswordResetComponent) },
    { path: '**', redirectTo: '/notfound' }
] satisfies AppRoute[];