import express, { Request, Response } from 'express';
import { CreateScopeRequest, CreateScopeResponse } from '../dtos/scope.dto';
import { ScopesType } from '@prisma/client';
import { scopeRepository } from '../repositories/scope.repository';

export const scopeRouter = express.Router();

const createScope = async (req: Request, res: Response) => {
  if (
    !req.body.name ||
    !req.body.type ||
    !Object.keys(ScopesType).includes(req.body.type)
  ) {
    res.status(401);
    res.send({ error: 'Invalid request body' });
    return;
  }

  const createScopeRequest: CreateScopeRequest = req.body;
  const newScope = await scopeRepository.createScope(createScopeRequest);
  const response: CreateScopeResponse = {
    id: newScope.id,
    name: createScopeRequest.name,
    type: createScopeRequest.type,
  };

  res.status(201);
  res.send(response);
};

scopeRouter.post('/', createScope);
