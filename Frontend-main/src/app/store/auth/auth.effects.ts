// src/app/auth/store/effects/auth.effects.ts

import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of, Subscription, timer } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';

import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class AuthEffects implements OnDestroy {

  // this is the timer that periodically refresh the access token
  private timerRefreshAccessTokenSubscription?: Subscription | null;
  refreshTimerRefreshTokenSuscription(accessToken: string) {
    if (this.timerRefreshAccessTokenSubscription) {
      this.timerRefreshAccessTokenSubscription.unsubscribe();
      this.timerRefreshAccessTokenSubscription = null;
    }

    if (accessToken) {
      const MilliSecondsLeft = Math.round(0.9 * (JSON.parse(atob(accessToken.split('.')[1])).exp * 1000 - Date.now()));
      this.timerRefreshAccessTokenSubscription = timer(MilliSecondsLeft).subscribe(() => { this.store.dispatch(AuthActions.refreshToken()); });
      console.debug(`[${new Date().toLocaleString()}] AuthEffects: Token obtained successfully, refresh in ${MilliSecondsLeft / 1000} seconds`);
    }

  }

  // ----------------------------------------------------------------------------------------------------------------------------
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(action =>
        this.authService.register(action.registerDto).pipe(
          map(response => AuthActions.registerSuccess({ message: response.message })),
          catchError(error => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );



  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(action => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: action.message });
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );


  registerFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Registration Failed' });
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action => this.authService.login(action.loginDto).pipe(
        map(response => AuthActions.loginSuccess({ accessToken: response.accessToken })),
        catchError(error => of(AuthActions.loginFailure({ error })))
      )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(action => {
        this.refreshTimerRefreshTokenSuscription(action.accessToken);
        localStorage.setItem('accessToken', action.accessToken);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful' });
        this.router.navigate(['/']);
      })
    ), { dispatch: false }
  );


  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Login Failed' });
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  confirmEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmEmail),
      mergeMap(action =>
        this.authService.confirmEmail(action.token).pipe(
          map(response => AuthActions.confirmEmailSuccess({ message: response.message })),
          catchError(error => of(AuthActions.confirmEmailFailure({ error })))
        )
      )
    )
  );

  confirmEmailSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmEmailSuccess),
      tap(action => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: action.message });
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );


  confirmEmailFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmEmailFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Email Confirmation Failed' });
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(response => AuthActions.logoutSuccess({ message: response.message })),
          catchError(error => of(AuthActions.logoutFailure({ error })))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        localStorage.removeItem('accessToken');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully' });
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );

  logoutFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Logout Failed' });
      })
    ), { dispatch: false }
  );


  // ----------------------------------------------------------------------------------------------------------------------------
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(() => this.authService.refreshToken().pipe(
        map(accessToken => AuthActions.refreshTokenSuccess(accessToken)),
        catchError(error => of(AuthActions.refreshTokenFailure({ error })))
      )
      )
    )
  );

  refreshTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenSuccess),
      tap(action => {
        this.refreshTimerRefreshTokenSuscription(action.accessToken);
        localStorage.setItem('accessToken', action.accessToken);

      })
    ), { dispatch: false }
  );

  refreshTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Token refresh failed' });
        // Optionally navigate to login page or perform logout
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuthState),
      // Perform any necessary async operations here
      map(() => AuthActions.initializeAuthStateSuccess())
    )
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  passwordForgot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordForgot),
      mergeMap(action =>
        this.authService.passwordForgot(action.passwordForgotDto).pipe(
          map(response => AuthActions.passwordForgotSuccess({ message: response.message })),
          catchError(error => of(AuthActions.passwordForgotFailure({ error })))
        )
      )
    )
  );


  passwordForgotSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordForgotSuccess),
      tap(action => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: action.message });
      })
    ), { dispatch: false }
  );


  passwordForgotFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordForgotFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Password Reset Failed' });
      })
    ), { dispatch: false }
  );


  // ----------------------------------------------------------------------------------------------------------------------------
  passwordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordReset),
      mergeMap(action =>
        this.authService.passwordReset(action.passwordResetDto).pipe(
          map(response => AuthActions.passwordResetSuccess({ message: response.message })),
          catchError(error => of(AuthActions.passwordResetFailure({ error })))
        )
      )
    )
  );


  passwordResetSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordResetSuccess),
      tap(action => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: action.message });
        this.router.navigate(['/auth/login']);
      })
    ), { dispatch: false }
  );


  passwordResetFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.passwordResetFailure),
      tap(action => {
        this.configService.incrementServerIndex();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Password Reset Failed' });
      })
    ), { dispatch: false }
  );


  // -----------------------------------------------------------------
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private messageService: MessageService,
    private configService: ConfigService,
  ) { }

  ngOnDestroy() {
    // This ensures the timer is properly cleaned up when the component is destroyed
    this.refreshTimerRefreshTokenSuscription(null);
  }
}
