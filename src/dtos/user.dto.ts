import { Role } from '@prisma/client';

export interface CreateUserRequest {
  email: string;
  password: string;
  roles?: Role[];
}

export interface CreateUserResponse {
  id: string;
  email: string;
  roles?: Role[];
}

export interface GetUserByIdResponse {
  id: string;
  email: string;
  roles?: Role[];
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  roles?: Role[];
}

export interface UpdateUserResponse {
  id: string;
  email?: string;
  password?: string;
  roles?: Role[];
}
