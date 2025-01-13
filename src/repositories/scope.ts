import { ResultSetHeader } from 'mysql2';
import { executeQuery } from '../db-connection';
import { CreateScopeRequest } from '../dtos/scope';
import { Scope } from '../models/scope';

export const addScope = async (
  createScopeRequest: CreateScopeRequest,
): Promise<number | undefined> => {
  const query = 'INSERT INTO scopes (name, type) VALUES (?, ?);';
  const params = [createScopeRequest.name, createScopeRequest.type];
  const results = await executeQuery<ResultSetHeader>(query, params);

  return results.insertId;
};

export const getScopeById = async (scopeId: number): Promise<Scope | undefined> => {
  const query = 'SELECT * FROM scopes WHERE id = ?;';
  const params = [scopeId];
  const results = await executeQuery<Scope[]>(query, params);

  if (results.length > 0) {
    return results[0];
  }
};

export const updateScopeR = async (scope: Scope) => {
	const query = 'UPDATE scopes SET name = ?, type = ? WHERE id = ?;';
	const params = [scope.name, scope.type, scope.id]
	const result = await executeQuery<ResultSetHeader>(query, params);

	console.log(result);

	if (result.affectedRows === 1) {
		return result;
	}
}

export const deleteScopeR = async (scope: Scope) => {
	const query = 'DELETE FROM scopes WHERE id = ?;';
	const params = [scope.id]
	const result = await executeQuery<ResultSetHeader>(query, params);

	if (result.affectedRows === 1) {
		return result;
	}
}
