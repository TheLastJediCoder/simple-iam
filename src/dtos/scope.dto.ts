import { Scope, ScopesType } from '@prisma/client';

export interface CreateScopeRequest {
  name: string;
  type: ScopesType;
}
export type CreateScopeResponse = Scope;

export type GetScopeByIdResponse = Scope | null;

export interface UpdateScopeRequest {
  id: string;
  name?: string;
  type?: ScopesType;
}

export type UpdateScopeResponse = Scope;
