import express, { Request, Response } from 'express';
import { LoginRequest, LoginResponse } from '../dtos/auth';
import { getUserByEmail } from '../repositories/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../repositories/access-token';

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req: Request, res: Response) => {
  if (!req.body.email) {
    res.status(404);
    res.send({ error: 'Email is required for login' });
    return;
  }

  if (!req.body.password) {
    res.status(404);
    res.send({ error: 'Password is required for login' });
    return;
  }

  const loginRequest = req.body as LoginRequest;
  const user = await getUserByEmail(loginRequest.email);

  if (!user) {
    res.status(401);
    res.send({ error: 'Invalid credentials' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    res.status(401);
    res.send({ error: 'Invalid credentials' });
    return;
  }

  const accessToken = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
    expiresIn: '5m',
  });

  await createAccessToken(accessToken, user);

  const response: LoginResponse = {
    accessToken: accessToken,
  };

  res.status(200);
  res.send(response);
};

authRouter.post('/login', login);
