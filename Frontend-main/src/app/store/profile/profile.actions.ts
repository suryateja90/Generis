// src/app/store/auth/auth.actions.ts
// Create actions to handle authentication processes.

import { createAction, props } from '@ngrx/store';

import { SeguridadUserModel } from 'src/shared/models/seguridad-user.model';

// --------------------------------------------------------------------------------------------------
export const loadProfile = createAction(
  '[Profile] Load Profile'
);

export const loadProfileSuccess = createAction(
  '[Profile] Load Profile Success',
  props<{ profile: SeguridadUserModel }>()
);

export const loadProfileFailure = createAction(
  '[Profile] Load Profile Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<{ profile: SeguridadUserModel }>()
);
export const updateProfileSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ profile: SeguridadUserModel }>()
);
export const updateProfileFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ error: any }>()
);
