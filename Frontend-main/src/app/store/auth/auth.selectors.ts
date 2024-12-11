// src/app/auth/store/selectors/auth.selectors.ts
// Create selectors to access specific pieces of the authentication state.

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.refreshToken
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthErrorMessage = createSelector(
  selectAuthError,
  (error: any) => error?.error?.message ?? null
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (accessToken) => !!accessToken
);

