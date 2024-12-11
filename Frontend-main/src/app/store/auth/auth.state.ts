// src/app/store/auth/auth.state.ts
// Each feature should have its own state interface:

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  error: any;
  loading: boolean;
};

export const initialAuthState: AuthState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
};
