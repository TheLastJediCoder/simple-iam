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
