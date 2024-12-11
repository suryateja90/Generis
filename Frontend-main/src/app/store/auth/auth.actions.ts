// src/app/auth/store/actions/auth.actions.ts
// Create actions to handle authentication processes.

import { createAction, props } from '@ngrx/store';

import { LoginAuthModel } from 'src/shared/models/login-auth.model';
import { PasswordForgotAuthModel } from 'src/shared/models/password-forgot-auth.model';
import { PasswordResetAuthModel } from 'src/shared/models/password-reset-auth.model';
import { RegisterAuthModel } from 'src/shared/models/register-auth.model';

// --------------------------------------------------------------------------------------------------
export const register = createAction(
  '[Auth] Register',
  props<{ registerDto: RegisterAuthModel }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ message: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const login = createAction(
  '[Auth] Login',
  props<{ loginDto: LoginAuthModel }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const confirmEmail = createAction(
  '[Auth] Confirm Email',
  props<{ token: string }>()
);

export const confirmEmailSuccess = createAction(
  '[Auth] Confirm Email Success',
  props<{ message: string }>()
);

export const confirmEmailFailure = createAction(
  '[Auth] Confirm Email Failure',
  props<{ error: any }>()
);


// --------------------------------------------------------------------------------------------------
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction(
  '[Auth] Logout Success',
  props<{ message: string }>()
);

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const initializeAuthState = createAction('[Auth] Initialize State');
export const initializeAuthStateSuccess = createAction('[Auth] Initialize Auth State Success');
export const initializeAuthStateFailure = createAction('[Auth] Initialize Auth State Failure', props<{ error: any }>());

// --------------------------------------------------------------------------------------------------
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const passwordForgot = createAction(
  '[Auth] Password Forgot',
  props<{ passwordForgotDto: PasswordForgotAuthModel }>()
);

export const passwordForgotSuccess = createAction(
  '[Auth] Password Forgot Success',
  props<{ message: string }>()
);

export const passwordForgotFailure = createAction(
  '[Auth] Password Forgot Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const passwordReset = createAction(
  '[Auth] Password Reset',
  props<{ passwordResetDto: PasswordResetAuthModel }>()
);

export const passwordResetSuccess = createAction(
  '[Auth] Password Reset Success',
  props<{ message: string }>()
);

export const passwordResetFailure = createAction(
  '[Auth] Password Reset Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const clearError = createAction('[Auth] Clear Error');