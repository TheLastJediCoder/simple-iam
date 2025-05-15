import express, { Request, Response } from 'express'; // Import Express framework and related types
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetUserByIdResponse,
} from '../dtos/user.dto';
import { Prisma, Role } from '@prisma/client';
import { roleRepository } from '../repositories/role.repository';
import { userRoleRepository } from '../repositories/user-role.repository';
import { userRepository } from '../repositories/user.repository';

export const userRouter = express.Router();
/**
 * Handles the addition of a new user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const addUser = async (req: Request, res: Response) => {
  // Cast the request body to the CreateUserRequest DTO
  const createUserRequest = req.body as CreateUserRequest;
  // Generate a salt for password hashing
  const salt = await bcrypt.genSalt(12);
  // Check if a user with the same email already exists

  const existingUser = await userRepository.getUserByEmail(
    createUserRequest.email,
  );

  if (existingUser) {
    res.status(400).json('Please pick different email');
    return;
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(createUserRequest.password, salt);
  // Prepare user data for creation
  const user: Prisma.UserCreateInput = {
    email: createUserRequest.email,
    passwordHash: hashedPassword,
  };
  // Create the new user in the database
  const newUser = await userRepository.createUser(user);
  const roles: Role[] = [];

  // If roles are provided in the request, process them
  if (createUserRequest.roles) {
    for (const role of createUserRequest.roles) {
      // Verify if the role exists in the database

      const verifiedRole = await roleRepository.getRoleById(role.id);

      if (!verifiedRole) {
        res.status(404);
        res.send({ error: `Role with roleId: ${role.id}` });
        return;
      }

      roles.push(verifiedRole);
    }
    // Link the new user to the specified roles

    await userRoleRepository.linkUserToRoles(newUser, roles);
  }

  // Prepare the response object
  const response: CreateUserResponse = {
    id: newUser.id,
    email: newUser.email,
    roles: roles,
  };

  res.status(201);
  // Send the response
  res.send(response);
};
/**
 * Retrieves a user by their ID.
 *
 * @param req - The Express request object (expects user ID in params).
 * @param res - The Express response object.
 */
const getUserById = async (req: Request, res: Response) => {
  // Extract the user ID from the request parameters
  const userId = req.params.id;
  const user = await userRepository.getUserById(userId);

  if (!user) {
    res.status(404).json({ error: `User with id ${userId} not found` });
    return;
  }

  // Prepare the response object including user details and their roles
  const response: GetUserByIdResponse = {
    id: user.id,
    email: user.email,
    // Map the UserRole objects to just the Role objects
    roles: user.usersRoles.map((userRole) => userRole.roles),
  };

  res.status(200).json(response);
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updateUserRequest = req.body as UpdateUserRequest;

  const existingUser = await userRepository.getUserById(userId);

  if (!existingUser) {
    res.status(404).json({ error: `User with id ${userId} not found` });
    return;
  }

  // If a new password is provided, hash it
  let passwordHash: string | undefined;
  if (updateUserRequest.password) {
    const salt = await bcrypt.genSalt(12);
    passwordHash = await bcrypt.hash(updateUserRequest.password, salt);
  }

  const userData: Prisma.UserUpdateInput = {
    email: updateUserRequest.email,
    passwordHash: passwordHash,
  };

  // Update the user in the database
  const updatedUser = await userRepository.updateUser(userId, userData);

  // If roles are provided in the request, update the user's roles
  if (updateUserRequest.roles !== undefined) {
    await userRoleRepository.unlinkUserFromAllRoles(userId);
    // Unlink existing roles and link new roles
    const roles: Role[] = [];
    for (const role of updateUserRequest.roles) {
      const verifiedRole = await roleRepository.getRoleById(role.id);
      if (!verifiedRole) {
        res
          .status(404)
          .json({ error: `Role with roleId: ${role.id} not found` });
        return;
      }
      roles.push(verifiedRole);
    }
    // Link the user to the new set of roles
    await userRoleRepository.linkUserToRoles(updatedUser, roles);
  }

  // Prepare the response object including updated user details and their roles
  const response: UpdateUserResponse = {
    id: updatedUser.id,
    email: updatedUser.email,
    // Map the UserRole objects to just the Role objects

    roles: existingUser.usersRoles.map((userRole) => userRole.roles),
  };

  res.status(200).json(response);
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  await userRepository.deleteUser(userId);
  res.status(204).send();
};
userRouter.post('/', addUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
