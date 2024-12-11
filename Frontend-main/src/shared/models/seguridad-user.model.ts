export interface SeguridadUserModel {

  id?: number;

  username?: string;
  //password?: string;

  name?: string;
  company?: string;
  area?: string;
  phone?: string;

  role?: string;
  level?: string;
  privileges?: string;
  created?: Date;

  ambiente_url_id?: string;
}