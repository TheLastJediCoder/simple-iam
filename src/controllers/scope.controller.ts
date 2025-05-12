import express, { Request, Response } from 'express';
import { CreateScopeRequest, CreateScopeResponse } from '../dtos/scope.dto';
import { scopeRepository } from '../repositories/scope.repository';
import { validate } from './middlewares/validation.middleware';

export const scopeRouter = express.Router();

const createScope = async (req: Request, res: Response) => {
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
