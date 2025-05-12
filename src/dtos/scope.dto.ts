import { Scope, ScopesType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export interface CreateScopeRequest {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEnum(ScopesType)
  type: ScopesType;
}
export type CreateScopeResponse = Scope;
