import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { CreateUserRequest, CreateUserResponse } from '../dtos/user.dto';
import { Prisma, Role } from '@prisma/client';
import { roleRepository } from '../repositories/role.repository';
import { userRoleRepository } from '../repositories/user-role.repository';
import { userRepository } from '../repositories/user.repository';

export const userRouter = express.Router();

const addUser = async (req: Request, res: Response) => {
  const createUserRequest = req.body as CreateUserRequest;
  const salt = await bcrypt.genSalt(12);
  const existingUser = await userRepository.getUserByEmail(createUserRequest.email);

  if (existingUser) {
    res.status(400).json('Please pick different email');
    return;
  }

  const hashedPassword = await bcrypt.hash(createUserRequest.password, salt);
  const user: Prisma.UserCreateInput = {
    email: createUserRequest.email,
    passwordHash: hashedPassword,
  };
  const newUser = await userRepository.createUser(user);
  const roles: Role[] = [];

  if (createUserRequest.roles) {
    for (const role of createUserRequest.roles) {
      const verifiedRole = await roleRepository.getRoleById(role.id);

      if (!verifiedRole) {
        res.status(404);
        res.send({ error: `Role with roleId: ${role.id}` });
        return;
      }

      roles.push(verifiedRole);
    }

    await userRoleRepository.linkUserToRoles(newUser, roles);
  }

  const response: CreateUserResponse = {
    id: newUser.id,
    email: newUser.email,
    roles: roles,
  };

  res.status(201);
  res.send(response);
};

userRouter.post('/', addUser);
