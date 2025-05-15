import express, { Request, Response } from 'express';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../dtos/auth.dto';
import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userTokenRepository } from '../repositories/user-token.repository';
import { Prisma } from '@prisma/client';

export const authRouter = express.Router();

// Secret key for JWT token signing. In a production environment,
// this should be stored securely, e.g., in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Handles user login.
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
  // Create a new user token entry in the database
  const userToken: Prisma.UserTokenCreateInput = {
    accessToken: accessToken,
    accessTokenExpiresAt: decodedToken.exp || 0,
    user: { connect: user },
    refreshToken: refreshToken,
    refreshTokenExpiresAt: decodedRefreshToken.exp || 0,
  };

  // Save the user token
  await userTokenRepository.createUserToken(userToken);

  const response: LoginResponse = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  res.status(200);
  res.send(response);
};

// Handles user logout by revoking the access token.
const logout = async (req: Request, res: Response) => {
  if (!req.body.accessToken) {
    res.status(401);
    res.send({ error: 'Access token is missing in request!' });
    return;
  }

  const logoutRequest: LogoutRequest = req.body;

  // Find the user token by access token
  const userToken = await userTokenRepository.getUserTokenByAccessToken(
    logoutRequest.accessToken,
  );

  if (!userToken || userToken.isRevoked) {
    res.status(404);
    res.send({ error: 'Access token not found!' });
    return;
  }

  // Revoke the user token
  await userTokenRepository.revokeUserToken(userToken);

  res.status(200);
  res.send({ success: 'Logout successfully' });
};

// Handles user registration.
// Creates a new user in the database.
const register = async (req: Request, res: Response) => {
  const registerRequest: RegisterRequest = req.body;

  if (!registerRequest.email || !registerRequest.password) {
    res.status(400).send({
      error: 'Email, password, and name are required for registration',
    });
    return;
  }

  // Check if a user with the same email already exists
  const existingUser = await userRepository.getUserByEmail(
    registerRequest.email,
  );
  if (existingUser) {
    res.status(409).send({ error: 'User with this email already exists' });
    return;
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

  const newUser: Prisma.UserCreateInput = {
    email: registerRequest.email,
    passwordHash: hashedPassword,
  };

  try {
    // Create the new user
    const user = await userRepository.createUser(newUser);
    res
      .status(201)
      .send({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send({ error: 'Failed to register user' });
  }
};

// Handles the forgot password request.
// In a real application, this would generate a reset token and send an email.
const forgotPassword = async (req: Request, res: Response) => {
  const forgotPasswordRequest: ForgotPasswordRequest = req.body;

  if (!forgotPasswordRequest.email) {
    res.status(400).send({ error: 'Email is required for password reset' });
    return;
  }

  // Find the user by email
  const user = await userRepository.getUserByEmail(forgotPasswordRequest.email);
  if (!user) {
    // Send a success response even if the user doesn't exist to avoid email enumeration
    res.status(200).send({
      message:
        'If a user with that email exists, a password reset link will be sent.',
    });
    return;
  }

  // In a real application, generate a unique token, save it to the database
  // with an expiry, and send an email to the user with a link containing the token.
  // For this example, we'll just send a success message.

  res.status(200).send({
    message:
      'If a user with that email exists, a password reset link will be sent.',
  });
};

// Handles the password reset request.
// Validates the provided token and updates the user's password.
// Assumes the token is provided in the Authorization header.
const resetPassword = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is in the Authorization header as Bearer token
  const { newPassword } = req.body as ResetPasswordRequest;

  if (!token || !newPassword) {
    res.status(400).send({
      error:
        'Token (in Authorization header) and new password are required for password reset',
    });
    return;
  }

  // In a real application, the token used for password reset would likely be a
  // dedicated reset token, not a refresh token. You would fetch it from a
  // dedicated reset token table. For this example, we'll re-use the refresh token fetching.
  // Find the user token by refresh token
  const userToken = await userTokenRepository.getUserTokenByRefreshToken(token);

  if (
    !userToken ||
    userToken.isRevoked ||
    userToken.refreshTokenExpiresAt < Math.floor(Date.now() / 1000)
  ) {
    res.status(400).send({ error: 'Invalid or expired password reset token' });
    return;
  }

  // Find the user associated with the token
  const user = await userRepository.getUserById(userToken.userId);

  if (!user) {
    // This case should ideally not happen if the token is valid and associated with a user
    res.status(500).send({ error: 'User not found for the provided token' });
    return;
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  await userRepository.updateUser(user.id, { passwordHash: hashedPassword });

  // In a real application, invalidate the used token.

  // Send a success response
  res.status(200).send({ message: 'Password reset successfully' });
};

const refreshToken = async (req: Request, res: Response) => {
  if (!req.body.refreshToken) {
    res.status(400);
    res.send({ error: 'Refresh token is missing in request!' });
    return;
  }

  const refreshTokenRequest: RefreshTokenRequest = req.body;
  // Find the user token by refresh token
  const userToken = await userTokenRepository.getUserTokenByRefreshToken(
    refreshTokenRequest.refreshToken,
  );

  if (!userToken) {
    res.status(404);
    res.send({ error: 'Refresh token not fount!' });
    return;
  }

  // Find the user associated with the token
  const user = await userRepository.getUserById(userToken.userId);
  const accessToken = jwt.sign(
    { email: user?.email, id: user?.id },
    JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );
  const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;

  // Update the user token with the new access token
  userToken.accessToken = accessToken;
  userToken.accessTokenExpiresAt = decodedToken.exp || 0;

  // Save the updated user token
  const updatedUserToken = await userTokenRepository.updateUserToken(userToken);

  const response: RefreshTokenResponse = {
    accessToken: updatedUserToken.accessToken,
    refreshToken: updatedUserToken.refreshToken,
  };

  res.status(200);
  res.send(response);
};

// Simple endpoint to test authorization with middleware.
const authorize = async (req: Request, res: Response) => {
  res.status(200);
  res.send({ message: 'Successfully authorize' });
};

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/authorize', authorize);
authRouter.post('/register', register);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
