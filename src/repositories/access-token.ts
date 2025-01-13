import { ResultSetHeader } from 'mysql2';
import { executeQuery } from '../db-connection';
import { User } from '../models/user';

export const createAccessToken = async (
  accessToken: string,
  user: User,
): Promise<number | undefined> => {
  const expiresAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const query =
    'INSERT INTO access_tokens (access_token, expires_at, user_id) VALUES (?, ?, ?);';
  const params = [accessToken, expiresAt, user.id];
  const result = await executeQuery<ResultSetHeader>(query, params);

  return result.insertId;
};
