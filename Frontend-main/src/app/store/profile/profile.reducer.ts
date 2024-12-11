// src/app/store/profile/profile.reducer.ts
// Define the Profileentication state and create a reducer to handle state changes.

import { createReducer, on } from '@ngrx/store';

import * as ProfileActions from './profile.actions';

import { initialProfileState } from './profile.state';

export const profileReducer = createReducer(
  initialProfileState,

  // Load Profile
  // in this case we affect the loading state as we want to show a loading progress bar or something similar
  on(ProfileActions.loadProfile, state => ({ ...state, loading: true })),
  on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({ ...state, profile, loading: false })),
  on(ProfileActions.loadProfileFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Update Profile
  // in this case we affect the loading state as we want to show a loading progress bar or something similar
  on(ProfileActions.updateProfile, state => ({ ...state, loading: true })),
  on(ProfileActions.updateProfileSuccess, (state) => ({ ...state, loading: false })),
  on(ProfileActions.updateProfileFailure, (state, { error }) => ({ ...state, error, loading: false })),
);
