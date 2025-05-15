import express, { Request, Response } from 'express';
import {
  // Import DTOs for request and response bodies
  CreateScopeRequest,
  CreateScopeResponse,
  GetScopeByIdResponse,
  UpdateScopeRequest,
  UpdateScopeResponse,
} from '../dtos/scope.dto';
import { ScopesType } from '@prisma/client';
// Import the scope repository for database interactions
import { scopeRepository } from '../repositories/scope.repository';

// Create an Express router for scope-related routes
export const scopeRouter = express.Router();

/**
 * Handles the creation of a new scope.
 * Validates the request body and uses the scope repository to create the scope.
 * Returns the created scope details or an error response.
 */
const createScope = async (req: Request, res: Response) => {
  // Validate the presence and type of required fields in the request body
  if (
    // Check if name or type are missing
    !req.body.name ||
    !req.body.type ||
    !Object.keys(ScopesType).includes(req.body.type)
  ) {
    res.status(401);
    res.send({ error: 'Invalid request body' });
    return;
  }

  // Cast the request body to the CreateScopeRequest DTO
  const createScopeRequest: CreateScopeRequest = req.body;
  // Use the repository to create the new scope in the database
  const newScope = await scopeRepository.createScope(createScopeRequest);
  const response: CreateScopeResponse = {
    // Construct the response object based on the created scope
    id: newScope.id,
    name: createScopeRequest.name,
    type: createScopeRequest.type,
  };

  res.status(201);
  res.send(response);
};

/**
 * Handles fetching a scope by its ID.
 * Extracts the scope ID from the request parameters and uses the scope repository to find the scope.
 * Returns the scope details or an appropriate error response if not found or an error occurs.
 */
const getScopeById = async (req: Request, res: Response) => {
  const scopeId = req.params.id;

  // Check if the scope ID is provided in the request parameters
  if (!scopeId) {
    res.status(400).send({ error: 'Scope ID is required' });
    return;
  }

  try {
    const scope = await scopeRepository.getScopeById(scopeId);
    // Check if a scope with the provided ID was found
    if (!scope) {
      res.status(404).send({ error: 'Scope not found' });
      return;
    }

    const response: GetScopeByIdResponse = {
      // Construct the response object with the scope details
      id: scope.id,
      name: scope.name,
      type: scope.type,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error('Error fetching scope by ID:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * Handles updating an existing scope by its ID.
 * Extracts the scope ID from parameters and update data from the body.
 * Uses the scope repository to update the scope.
 * Returns the updated scope details or an error response.
 */
const updateScope = async (req: Request, res: Response) => {
  const scopeId = req.params.id;
  const updateScopeRequest: UpdateScopeRequest = req.body;
  // Check if both scope ID and update data are provided
  if (!scopeId || !updateScopeRequest) {
    res.status(400).send({ error: 'Scope ID and update data are required' });
    return;
  }

  try {
    const updatedScope = await scopeRepository.updateScope(
      scopeId,
      updateScopeRequest,
    );
    const response: UpdateScopeResponse = {
      // Construct the response object with the updated scope details
      id: updatedScope.id,
      name: updatedScope.name,
      type: updatedScope.type,
    };

    res.status(200).send(response);
  } catch (error) {
    console.error('Error updating scope:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

/**
 * Handles deleting a scope by its ID.
 * Extracts the scope ID from the request parameters.
 * Uses the scope repository to delete the scope.
 * Returns a success status code (204 No Content) or an error response.
 */
const deleteScope = async (req: Request, res: Response) => {
  const scopeId = req.params.id;

  // Check if the scope ID is provided in the request parameters
  if (!scopeId) {
    res.status(400).send({ error: 'Scope ID is required' });
    return;
  }
  // Use the repository to delete the scope
  await scopeRepository.deleteScope(scopeId);
  // Send a 204 No Content status code on successful deletion
  res.status(204).send();
};

// Define the routes and link them to the corresponding controller functions
scopeRouter.post('/', createScope);
scopeRouter.get('/:id', getScopeById);
scopeRouter.put('/:id', updateScope);
scopeRouter.delete('/:id', deleteScope);
