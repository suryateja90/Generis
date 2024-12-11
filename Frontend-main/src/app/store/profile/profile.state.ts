// src/app/store/profile/profile.state.ts
// Each feature should have its own state interface:

import { SeguridadUserModel } from 'src/shared/models/seguridad-user.model';

export interface ProfileState {
  profile: SeguridadUserModel | null;
  error: string | null;
  loading: boolean;
};

export const initialProfileState: ProfileState = {
  profile: null,
  error: null,
  loading: false,
};
