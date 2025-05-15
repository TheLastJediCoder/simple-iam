import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userTokenRepository } from '../repositories/user-token.repository';

interface DecodedUser {
  id: number;
  // add other user properties if needed
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedUser;
  }
}

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (token == null) {
    res.sendStatus(401); // If there's no token, return 401 Unauthorized
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    const userToken =
      await userTokenRepository.getUserTokenByAccessToken(token);

    if (userToken && userToken.isRevoked) {
      res.sendStatus(401); // If token is revoked, return 401 Unauthorized
      return;
    }

    const decoded = jwt.decode(token) as jwt.JwtPayload;

    req.user = decoded as DecodedUser;
    next(); // Proceed to the next middleware or route handler
  } catch {
    res.sendStatus(401); // If token is revoked, return 401 Unauthorized
    return;
  }
};

export default validateToken;
