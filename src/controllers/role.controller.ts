import express, { Request, Response } from 'express';
import { Prisma, Scope } from '@prisma/client';
import {
  CreateRoleRequest,
  CreateRoleResponse,
  GetRoleByIdResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
} from '../dtos/role.dto';
import { roleRepository } from '../repositories/role.repository';
import { scopeRepository } from '../repositories/scope.repository';
import { roleScopeRepository } from '../repositories/role-scope.repository';

export const roleRouter = express.Router();

/**
 * Handles the creation of a new role.
 * It expects a request body with a 'name' property and optionally a 'scopes' array of scope IDs.
 * It validates the request body, creates the role in the database, links it to provided scopes,
 * and returns the newly created role with its associated scopes.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const createRole = async (req: Request, res: Response) => {
  if (!req.body.name) {
    res.status(401);
    res.send({ error: 'Invalid request body' });
    return;
  }

  const request: CreateRoleRequest = req.body;
  const role: Prisma.RoleCreateInput = {
    name: request.name,
  };
  const newRole = await roleRepository.createRole(role);
  const scopes: Scope[] = [];
  // If scopes are provided in the request, link the new role to these scopes
  if (request.scopes) {
    for (const scope of request.scopes) {
      // Iterate through provided scope IDs
      const verifiedScope = await scopeRepository.getScopeById(scope.id);

      if (!verifiedScope) {
        res.status(404);
        res.send({ error: `Scope with scopeId: ${scope.id} not found` });
        return;
      }

      scopes.push(verifiedScope);
    } // Link the new role to the verified scopes

    await roleScopeRepository.linkRoleToScopes(newRole, scopes);
  }

  // Construct the response object
  const response: CreateRoleResponse = {
    id: newRole.id,
    name: newRole.name,
    scopes: scopes,
  };

  res.status(201);
  res.send(response);
};

/**
 * Retrieves a role by its ID.
 * It expects the role ID as a parameter in the request URL.
 * It fetches the role from the database along with its associated scopes and returns it.
 * Returns a 404 if the role is not found.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const getRoleById = async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const role = await roleRepository.getRoleByIdWithScopes(roleId);

  if (!role) {
    res.status(404);
    res.send({ error: `Role with id: ${roleId} not found` });
    return;
  }

  const response: GetRoleByIdResponse = {
    // Construct the response object
    id: role.id,
    name: role.name,
    scopes: role.scopes, // Assuming role includes scopes through roleScope relationship
  };

  res.status(200);
  res.send(response);
};

/**
 * Updates an existing role by its ID.
 * It expects the role ID as a parameter in the request URL and updated role data in the request body.
 * It can update the role's name and/or its associated scopes.
 * Returns a 404 if the role is not found.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const updateRole = async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const request: UpdateRoleRequest = req.body;

  const existingRole = await roleRepository.getRoleByIdWithScopes(roleId);

  if (!existingRole) {
    res.status(404);
    res.send({ error: `Role with id: ${roleId} not found` });
    return;
  }

  const updatedRoleData: Prisma.RoleUpdateInput = {
    // Prepare updated role data
    name: request.name || existingRole.name, // Allow partial updates
  };

  const updatedRole = await roleRepository.updateRole(roleId, updatedRoleData);
  let updatedScopes: Scope[] = existingRole.scopes;

  // If scopes are provided in the request, update the role's scope associations
  if (request.scopes && updatedRole) {
    // Assuming request.scopes is a full list of desired scopes, relink all
    // Assuming request.scopes is a full list of desired scopes, relink all
    await roleScopeRepository.unlinkRoleFromAllScopes(updatedRole.id);
    updatedScopes = [];
    for (const scope of request.scopes) {
      const verifiedScope = await scopeRepository.getScopeById(scope.id);
      if (!verifiedScope) {
        res.status(404);
        res.send({ error: `Scope with scopeId: ${scope.id} not found` });
        return;
      }
      updatedScopes.push(verifiedScope);
    }
    await roleScopeRepository.linkRoleToScopes(updatedRole, updatedScopes); // Link the updated role to the new set of scopes
  }

  const response: UpdateRoleResponse = {
    // Construct the response object
    id: updatedRole?.id || existingRole.id,
    name: updatedRole?.name || existingRole.name,
    scopes: updatedScopes,
  };

  res.status(200);
  res.send(response);
};

/**
 * Deletes a role by its ID.
 * It expects the role ID as a parameter in the request URL.
 * It deletes the role from the database.
 * Returns a 204 No Content response on successful deletion.
 * @param req The Express request object.
 * @param res The Express response object.
 */
const deleteRole = async (req: Request, res: Response) => {
  const roleId = req.params.id;
  await roleRepository.deleteRole(roleId);
  res.status(204).send();
};
roleRouter.post('/', createRole);
roleRouter.get('/:id', getRoleById);
roleRouter.put('/:id', updateRole);
roleRouter.delete('/:id', deleteRole);
