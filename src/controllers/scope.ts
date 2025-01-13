import express, { Request, Response } from 'express';
import {
  CreateScopeRequest,
  CreateScopeResponse,
  UpdateScopeRequest,
} from '../dtos/scope';
import {
  addScope,
  deleteScopeR,
  getScopeById,
  updateScopeR,
} from '../repositories/scope';
import { ScopeType } from '../models/scope';

export const scopeRouter = express.Router();

const createScope = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.type) {
    res.status(401);
    res.send({ error: 'Invalid request body' });
    return;
  }

  const createScopeRequest: CreateScopeRequest = req.body;
  const scopeId = await addScope(createScopeRequest);

  if (!scopeId) {
    res.status(401);
    res.send({ error: 'Invalid request body' });
    return;
  }

  const response: CreateScopeResponse = {
    id: scopeId,
    name: createScopeRequest.name,
    type: createScopeRequest.type,
  };

  res.status(200);
  res.send(response);
  return;
};

const getScope = async (req: Request, res: Response) => {
  const scopeId = Number(req.params.scopeId);
  const scope = await getScopeById(scopeId);

  if (!scope) {
    res.status(404);
    res.send({ error: `Scope not found for scopeId: ${scopeId}` });
    return;
  }

  res.status(200);
  res.send(scope);
  return;
};

const updateScope = async (req: Request, res: Response) => {
  const scopeId = Number(req.params.scopeId);
  const scope = await getScopeById(scopeId);

  if (!scope) {
    res.status(404);
    res.send({ error: `Scope not found for scopeId: ${scopeId}` });
    return;
  }

	if (req.body.type && (!(req.body.type in ScopeType) || !isNaN(req.body.type ))) {
		res.status(401);
		res.send ({error: `Scope Type: ${req.body.type} is not allowed`})
		return;
	}

  const updateScopeRequest: UpdateScopeRequest = req.body;

  scope.name = updateScopeRequest.name || scope.name;
  scope.type = updateScopeRequest.type || scope.type;

  const result = await updateScopeR(scope);

	if (!result) {
		res.status(500);
    res.send({ error: `Unable to update scope for scopeId: ${scopeId}` });
    return;
	}

  res.status(200);
  res.send(scope);
  return;
};

const deleteScope = async (req: Request, res: Response) => {
  const scopeId = Number(req.params.scopeId);
  const scope = await getScopeById(scopeId);

  if (!scope) {
    res.status(404);
    res.send({ error: `Scope not found for scopeId: ${scopeId}` });
    return;
  }

  await deleteScopeR(scope);

  res.status(200);
  res.send({ success: 'Successfully deleted scope' });
  return;
};

scopeRouter.post('/', createScope);
scopeRouter.get('/:scopeId', getScope);
scopeRouter.patch('/:scopeId', updateScope);
scopeRouter.delete('/:scopeId', deleteScope);
