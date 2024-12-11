// src/app/auth/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ConfigService } from 'src/app/services/config.service';
import { loginSuccess } from 'src/app/store/auth/auth.actions';
import { LoginAuthModel } from 'src/shared/models/login-auth.model';
import { PasswordForgotAuthModel } from 'src/shared/models/password-forgot-auth.model';
import { PasswordResetAuthModel } from 'src/shared/models/password-reset-auth.model';
import { RegisterAuthModel } from 'src/shared/models/register-auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private get apiUrl(): string {
    return this.configService.getApiUrl();  // Use dynamic API URL from ConfigService
  }

  // --------------------------------------------------------------------------------------------------
  constructor(
    private store: Store,
    private http: HttpClient,
    private configService: ConfigService,
  ) {

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {

      // Set the timer to reciver the access token and refresh token for the case of refreshing the page, recover the access token and sent it to the loginSuccess action
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const MilliSecondsLeft = payload.exp * 1000 - Date.now();
      if (MilliSecondsLeft > 0) {
        // The constructor runs very early in the component lifecycle, often before NgRx effects are fully initialized. 
        // By using a setTimeout with a 0 delay, you're pushing the dispatch to the next event loop tick, which occurs after Angular has fully initialized all its systems, including NgRx effects.
        this.store.dispatch(loginSuccess({ accessToken })); // si no hago esto de inmediato, aparte, se nota que cae en la ventana de login
        setTimeout(() => this.store.dispatch(loginSuccess({ accessToken })), 0);
      }
      console.debug(`[${new Date().toLocaleString()}] AuthService: Auth Token will expire in ${Math.floor(MilliSecondsLeft / 1000)} seconds`);
    }
  }

  // --------------------------------------------------------------------------------------------------
  register(registerDto: RegisterAuthModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, registerDto, { withCredentials: true });
  }

  // --------------------------------------------------------------------------------------------------
  login(loginDto: LoginAuthModel): Observable<{ accessToken: string, id: number }> {
    return this.http.post<{ accessToken: string, id: number }>(`${this.apiUrl}/auth/login`, loginDto, { withCredentials: true }); // withCredentials: true: Ensures that cookies are sent with each request, allowing the backend to set and read HTTP-only cookies like refreshToken.    
  }

  // --------------------------------------------------------------------------------------------------
  confirmEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/confirm-email?token=${token}`);
  }

  // --------------------------------------------------------------------------------------------------
  passwordForgot(passwordForgotDto: PasswordForgotAuthModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password-forgot`, passwordForgotDto, { withCredentials: true });
  }

  // --------------------------------------------------------------------------------------------------
  passwordReset(passwordResetDto: PasswordResetAuthModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/password-reset`, passwordResetDto, { withCredentials: true });
  }

  // --------------------------------------------------------------------------------------------------
  refreshToken(): Observable<{ accessToken: string }> {
    // Assuming the backend reads refreshToken from HTTP-only cookie
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, {}, { withCredentials: true }); // withCredentials: true: Ensures that cookies are sent with each request, allowing the backend to set and read HTTP-only cookies like refreshToken.
  }

  // --------------------------------------------------------------------------------------------------
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true });
  }

}
