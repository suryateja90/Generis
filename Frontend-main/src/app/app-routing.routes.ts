// src/app/app-routing.routes
import { AuthGuard } from './auth/guards/auth.guard';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AppRoute } from './models/app-route.model';

export default [
    {
        path: '', component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: sessionStorage.getItem('lastRoute') || '/home' },

            { path: 'home', loadComponent: () => import('./dashboards/home/home.component').then(m => m.HomeComponent) },
            { path: 'desktrade', loadComponent: () => import('./dashboards/desktrade/desktrade.component').then(m => m.DesktradeComponent) },
            { path: 'arbitrade', loadComponent: () => import('./dashboards/arbitrade/arbitrade.component').then(m => m.ArbitradeComponent) },
            { path: 'test', loadComponent: () => import('./dashboards/test/test.component').then(m => m.TestComponent) },
            { path: 'reporting', loadComponent: () => import('./dashboards/reporting/reporting.component').then(m => m.ReportComponent) },

            { path: 'dashboard', loadComponent: () => import('../assets/demo/components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'uikit', loadChildren: () => import('../assets/demo/components/uikit/uikit-routing.routes') },
            { path: 'utilities', loadChildren: () => import('../assets/demo/components/utilities/utilities-routing.routes') },
            { path: 'documentation', loadComponent: () => import('../assets/demo/components/documentation/documentation.component').then(m => m.DocumentationComponent) },
            { path: 'blocks', loadComponent: () => import('../assets/demo/components/primeblocks/blocks/blocks.component').then(m => m.BlocksComponent) },
            { path: 'pages', loadChildren: () => import('../assets/demo/components/pages/pages-routing.routes') }
        ]
    },
    { path: 'auth', loadChildren: () => import('./auth/auth-routing.routes') },
    { path: 'landing', loadComponent: () => import('../assets/demo/components/landing/landing.component').then(m => m.LandingComponent) },
    { path: 'notfound', loadComponent: () => import('./notfound/notfound.component').then(m => m.NotfoundComponent) },
    { path: '**', redirectTo: '/notfound' },
] satisfies AppRoute[];
