import { ResultSetHeader } from 'mysql2';
import { executeQuery } from '../db-connection';
import { User } from '../models/user';
import { AccessToken } from '../models/access-token';

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

export const getAccessTokenByAccessToken = async (
  accessToken: string,
): Promise<AccessToken | undefined> => {
  const query = 'SELECT * FROM access_tokens WHERE access_token=?;';
  const params = [accessToken];
  const results = await executeQuery<AccessToken[]>(query, params);

  if (results.length > 0) {
    return results[0];
  }
};

export const deleteAccessToken = async (accessToken: AccessToken) => {
  const query = 'DELETE FROM access_tokens where id=?;';
  const params = [accessToken.id];
  const result = await executeQuery<ResultSetHeader>(query, params);

  if (result.affectedRows === 1) {
    return result;
  }
};
