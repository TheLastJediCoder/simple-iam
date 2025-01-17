import { Scope, ScopeType } from '../models/scope';

export interface CreateScopeRequest {
  name: string;
  type: ScopeType;
}

export type CreateScopeResponse = Scope;
export type UpdateScopeRequest = Partial<CreateScopeRequest>;
export type UpdateScopeResponse = Scope;
