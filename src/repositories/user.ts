import { ResultSetHeader } from 'mysql2';
import { executeQuery } from '../db-connection';
import { CreateUserRequest } from '../dtos/user';
import { User } from '../models/user';

export const getUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const query = 'SELECT * FROM users WHERE email = ?;';
  const params = [email];
  const results = await executeQuery<User[]>(query, params);

  if (results.length > 0) {
    return results[0];
  }
};

export const createUser = async (
  createUserRequest: CreateUserRequest,
  hashedPassword: string,
): Promise<number | undefined> => {
  const query = 'INSERT INTO users (email, password_hash) VALUES (?, ?);';
  const params = [createUserRequest.email, hashedPassword];
  const results = await executeQuery<ResultSetHeader>(query, params);

  return results.insertId;
};
