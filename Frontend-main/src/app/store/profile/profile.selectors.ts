// src/app/store/profile/profile.selectors.ts
// Create selectors to access specific pieces of the Profileentication state.

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ProfileState } from './profile.state';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectProfileError = createSelector(
  selectProfileState,
  (state: ProfileState) => state.error
);

export const selectProfileLoading = createSelector(
  selectProfileState,
  (state: ProfileState) => state.loading
);

// New Selector for Profile
export const selectProfile = createSelector(
  selectProfileState,
  (state: ProfileState) => state.profile
);

// upate profile error
export const selectUpdateProfileError = createSelector(
  selectProfileState,
  (state: ProfileState) => state.error
);

// update profile loading
export const selectUpdateProfileLoading = createSelector(
  selectProfileState,
  (state: ProfileState) => state.loading
);

// Selector for Update Profile
export const selectUpdateProfile = createSelector(
  selectProfileState,
  (state: ProfileState) => state.profile
);
