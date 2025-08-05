import { VOID_NULL } from "src/types/void_null";

export interface IAuthModel {
  access_token: string | VOID_NULL;
  refresh_token: string | VOID_NULL;
  roles: IAuthRole[];
}

export interface IAuthRole {
  id: number;
  value: string;
  priority: number;
}

export interface IAuthData {
  email: string;
  password: string;
}

export interface IAuthRefresh {
  refresh_token: string | VOID_NULL;
}

export interface IAuthModules {
  player: boolean;
  judge: boolean;
  creator: boolean;
  moderator: boolean;
  manager: boolean;
  admin: boolean;
  super_admin: boolean;
}
