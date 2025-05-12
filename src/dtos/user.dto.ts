import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export interface CreateUserRequest {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
  
  @IsOptional()
  @IsArray()
  roles?: Role[];
}

export interface CreateUserResponse {
  id: string;
  email: string;
  roles?: Role[];
}
