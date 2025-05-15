import { Scope } from '@prisma/client';

export interface CreateRoleRequest {
  name: string;
  scopes?: Scope[];
}

export interface GetRoleByIdResponse {
  id: string;
  name: string;
  scopes?: Scope[];
}

export interface UpdateRoleRequest {
  name?: string;
  scopes?: Scope[];
}

export interface UpdateRoleResponse {
  id: string;
  name: string;
  scopes?: Scope[];
}

export interface CreateRoleResponse {
  id: string;
  name: string;
  scopes?: Scope[];
}
