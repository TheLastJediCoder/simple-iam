import { Prisma, Scope } from '@prisma/client';
import express, { Request, Response } from 'express';
import { CreateRoleRequest, CreateRoleResponse } from '../dtos/role.dto';
import { roleRepository } from '../repositories/role.repository';
import { scopeRepository } from '../repositories/scope.repository';
import { roleScopeRepository } from '../repositories/role-scope.repository';
import { validate } from './middlewares/validation.middleware';

export const roleRouter = express.Router();

const createRole = async (req: Request, res: Response) => {
  const request: CreateRoleRequest = req.body;

  const role: Prisma.RoleCreateInput = {
    name: request.name,
  };
  const newRole = await roleRepository.createRole(role);
  const scopes: Scope[] = [];

  if (request.scopes) {
    for (const scope of request.scopes) {
      const verifiedScope = await scopeRepository.getScopeById(scope.id);

      if (!verifiedScope) {
        res.status(404);
        res.send({ error: `Scope with scopeId: ${scope.id} not found` });
        return;
      }

      scopes.push(verifiedScope);
    }

    await roleScopeRepository.linkRoleToScopes(newRole, scopes);
  }

  const response: CreateRoleResponse = {
    id: newRole.id,
    name: newRole.name,
    scopes: scopes,
  };

  res.status(201);
  res.send(response);
};

roleRouter.post('/', validate(CreateRoleRequest), createRole);
