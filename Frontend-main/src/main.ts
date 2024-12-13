
import APP_ROUTES from './app/app-routing.routes';

import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/auth/interceptors/auth.interceptor';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { environment } from './environments/environment';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// NgRX Store

import { appEffects } from './app/store/app.effects';
import { appReducer } from './app/store/app.reducer';

// Import widget components to allow the decorator to (even unused) add them all to the registry and circumvent Angular tree-shaking
import './app/widgets/blotter/blotter.component';
import './app/widgets/broadcast/broadcast.component';
import './app/widgets/echo/echo.component';
import './app/widgets/heartbeat/heartbeat.component';
import './app/widgets/opportunities/opportunities.component';
import './app/widgets/parameters-set/parameters-set.component';
import './app/widgets/parameters-view/parameters-view.component';
import './app/widgets/profile/profile.component';
import './app/widgets/test-dt/test-dt.component';
import './app/widgets/test-widget/test-widget.component';
import './app/widgets/ticket/ticket.component';
import './app/widgets/watchlist/watchlist.component';

// Reporting is a special case at this moment
import './app/widgets/report-catalog/report-catalog.component';
import './app/widgets/report-data/report-data.component';
import './app/widgets/report-log/report-log.component';
import './app/widgets/report-prompt/report-prompt.component';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
          APP_ROUTES,
          {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload'
          }
        ),
        StoreModule.forRoot(appReducer, {}),
        EffectsModule.forRoot(appEffects),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), }),
        StoreRouterConnectingModule.forRoot(),
      ),
      provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Provide the interceptor using useClass
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      MessageService, // PrimeNG toast components
      ConfirmationService, // PrimeNG confirm dialog components
    ]
  });

// voalá
bootstrap().catch(err => console.error(err));