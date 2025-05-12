import express, { Request, Response } from 'express';
import {
  AuthorizeRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../dtos/auth.dto';
import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userTokenRepository } from '../repositories/user-token.repository';
import { Prisma } from '@prisma/client';
import { validate } from '../middlewares/validation.middleware';

export const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req: Request, res: Response) => {
  if (!req.body.email) {
  const loginRequest = req.body as LoginRequest;
  const user = await userRepository.getUserByEmail(loginRequest.email);

  if (!user) {
    res.status(401);
    res.send({ error: 'Invalid credentials' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    res.status(401);
    res.send({ error: 'Invalid credentials' });
    return;
  }

  const accessToken = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, {
    expiresIn: '5m',
  });
  const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;
  const refreshToken = jwt.sign(
    { email: user.email, id: user.id },
    JWT_SECRET,
    {
      expiresIn: '12h',
    },
  );
  const decodedRefreshToken = jwt.decode(refreshToken) as jwt.JwtPayload;
  const userToken: Prisma.UserTokenCreateInput = {
    accessToken: accessToken,
    accessTokenExpiresAt: decodedToken.exp || 0,
    user: { connect: user },
    refreshToken: refreshToken,
    refreshTokenExpiresAt: decodedRefreshToken.exp || 0,
  };

  await userTokenRepository.createUserToken(userToken);

  const response: LoginResponse = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  res.status(200);
  res.send(response);
};

const logout = async (req: Request, res: Response) => {
  const logoutRequest: LogoutRequest = req.body;

  try {
    jwt.verify(logoutRequest.accessToken, JWT_SECRET);
  } catch {
    res.status(401);
    res.send({ error: 'Invalid Access token in request!' });
    return;
  }

  const userToken = await userTokenRepository.getUserTokenByAccessToken(
    logoutRequest.accessToken,
  );

  if (!userToken || userToken.isRevoked) {
    res.status(404);
    res.send({ error: 'Access token not found!' });
    return;
  }

  await userTokenRepository.revokeUserToken(userToken);

  res.status(200);
  res.send({ success: 'Logout successfully' });
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenRequest: RefreshTokenRequest = req.body;
  const userToken = await userTokenRepository.getUserTokenByRefreshToken(
    refreshTokenRequest.refreshToken,
  );

  if (!userToken) {
    res.status(404);
    res.send({ error: 'Refresh token not fount!' });
    return;
  }

  const user = await userRepository.getUserById(userToken.userId);
  const accessToken = jwt.sign(
    { email: user?.email, id: user?.id },
    JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );
  const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;

  userToken.accessToken = accessToken;
  userToken.accessTokenExpiresAt = decodedToken.exp || 0;

  const updatedUserToken = await userTokenRepository.updateUserToken(userToken);

  const response: RefreshTokenResponse = {
    accessToken: updatedUserToken.accessToken,
    refreshToken: updatedUserToken.refreshToken,
  };

  res.status(200);
  res.send(response);
};

const authorize = async (req: Request, res: Response) => {
  const authorizeRequest: AuthorizeRequest = req.body;
  const userToken = await userTokenRepository.getUserTokenByAccessToken(
    authorizeRequest.accessToken,
  );

  if (!userToken) {
    res.status(401);
    res.send({ error: 'Invlaid access token' });
  }

  res.status(200);
  res.send({ message: 'Successfully authorize' });
};

authRouter.post('/login', validate(LoginRequest), login);
authRouter.post('/logout', validate(LogoutRequest), logout);
authRouter.post('/refresh-token', validate(RefreshTokenRequest), refreshToken);
authRouter.post('/authorize', validate(AuthorizeRequest), authorize);
