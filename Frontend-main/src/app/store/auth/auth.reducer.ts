// src/app/store/auth/auth.reducer.ts
// Define the authentication state and create a reducer to handle state changes.

import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  // Register
  on(AuthActions.register, state => ({ ...state, loading: true })),
  on(AuthActions.registerSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Login
  on(AuthActions.login, state => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, { accessToken }) => ({ ...state, accessToken, loading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Confirm Email
  on(AuthActions.confirmEmail, state => ({ ...state, loading: true })),
  on(AuthActions.confirmEmailSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.confirmEmailFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Logout
  on(AuthActions.logout, state => ({ ...state, loading: true })),
  on(AuthActions.logoutSuccess, state => ({ ...initialAuthState })),
  on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Initialize Auth State
  on(AuthActions.initializeAuthState, state => ({ ...state, loading: false, error: null })),
  on(AuthActions.initializeAuthStateSuccess, (state) => ({ ...state, loading: false, error: null, initialized: true })),
  on(AuthActions.initializeAuthStateFailure, (state, { error }) => ({ ...state, error, loading: false, initialized: true })),

  // Refresh Token
  // on this one, we don't affect "loading" as we don't want to show a loading state for this action being an infrastructure one
  on(AuthActions.refreshToken, state => ({ ...state, loading: true })),
  on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({ ...state, accessToken, loading: false })),
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Password Forgot
  on(AuthActions.passwordForgot, state => ({ ...state, loading: true })),
  on(AuthActions.passwordForgotSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.passwordForgotFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Password Reset
  on(AuthActions.passwordReset, state => ({ ...state, loading: true })),
  on(AuthActions.passwordResetSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.passwordResetFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Clear Error
  on(AuthActions.clearError, state => ({ ...state, error: null, loading: false }))
);
