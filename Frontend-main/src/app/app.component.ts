import { Component, effect, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs';

import { initializeAuthState } from 'src/app/store/auth/auth.actions';
import { selectIsAuthenticated } from 'src/app/store/auth/auth.selectors';
import { getParameters } from 'src/app/store/parameters/parameters.actions';
import { loadProfile } from 'src/app/store/profile/profile.actions';
import { selectProfile } from 'src/app/store/profile/profile.selectors';
import { socketConnect, socketDisconnect } from 'src/app/store/websocket/websocket.actions';
import { selectSocketConnected } from 'src/app/store/websocket/websocket.selectors';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [ToastModule, ConfirmDialogModule, ProgressSpinnerModule, RouterOutlet,],
})
export class AppComponent implements OnInit {

    // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset    
    // Fenil suggested the usage of "selectSignal" vs "toSignal" that ends up being more performant, modern, signal-native and optimized approach
    public isAuth$ = this.store.selectSignal(selectIsAuthenticated);
    public profile$ = this.store.selectSignal(selectProfile);
    public connected$ = this.store.selectSignal(selectSocketConnected);

    constructor(
        private primengConfig: PrimeNGConfig,
        private store: Store,
        private router: Router,
        private layoutService: LayoutService, // Do not remove it as it's essential for proper theme loading.
    ) {
        effect(() => {
            if (this.isAuth$()) {
                this.store.dispatch(loadProfile());
                this.store.dispatch(getParameters());
                this.store.dispatch(socketConnect());
            }
            else {
                this.store.dispatch(socketDisconnect());
            }
        }, { allowSignalWrites: true } // Enable signal writes inside the effect
        );
    }

    private AuthRegExp = new RegExp('^\/auth', 'i');

    ngOnInit() {
        this.layoutService.appInit();

        this.primengConfig.ripple = true;
        this.store.dispatch(initializeAuthState());

        // We need to use RxJS because Angular's Router is built upon RxJS observables, and route change events like NavigationEnd are inherently observable streams
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            // ensure session storage is properly updated on route changes.
            if (!this.AuthRegExp.test(event.urlAfterRedirects)) {
                // prevent storing in the case event.urlAfterRedirects contains 'auth'
                sessionStorage.setItem('lastRoute', event.urlAfterRedirects);
            }
        });

    }
}
