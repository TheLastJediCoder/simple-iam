import { Scope } from '@prisma/client';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export interface CreateRoleRequest {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsArray()
  scopes?: Scope[];
}

export interface CreateRoleResponse {
  id: string;
  name: string;
  scopes?: Scope[];
}
