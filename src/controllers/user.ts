import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '../repositories/user';
import { CreateUserRequest, CreateUserResponse } from '../dtos/user';

export const uesrRouter = express.Router();

const addUser = async (req: Request, res: Response) => {
  const createUserRequest = req.body as CreateUserRequest;
  const salt = await bcrypt.genSalt(12);
  const existingUser = await getUserByEmail(createUserRequest.email);

  if (existingUser) {
    res.status(400).json('Please pick different email');
    return;
  }

  const hashedPassword = await bcrypt.hash(createUserRequest.password, salt);
  const userId = await createUser(createUserRequest, hashedPassword);

  const response: CreateUserResponse = {
    email: createUserRequest.email,
    id: Number(userId),
  };

  res.send(response);
  res.status(201);
};

uesrRouter.post('/', addUser);
