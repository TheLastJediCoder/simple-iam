import { Scope, ScopesType } from '@prisma/client';

export interface CreateScopeRequest {
  name: string;
  type: ScopesType;
}
export type CreateScopeResponse = Scope;
