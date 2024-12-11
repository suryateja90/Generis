// model register-auth.dto.ts

import { LoginAuthModel } from './login-auth.model';

export interface RegisterAuthModel extends LoginAuthModel {

  name?: string;
  company?: string;
  area?: string;
  phone?: string;

  role?: string;
  level?: string;
  privileges?: string;
  ambiente_url_id?: string;
}
