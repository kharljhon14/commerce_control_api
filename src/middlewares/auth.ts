import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { verifyAuthToken } from '../utils/tokens';
import { sql } from '../db';
import { User } from '../types/user';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

/**
 * Middleware to ensure that the user is authenticated.
 */
export async function isAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers['authorization'];

    const token = authHeader?.split('Bearer ')[1];

    if (!token) return response.status(401).json({ message: 'Unauthorized' });

    const result = verifyAuthToken(token) as JwtPayload;

    const userRes = await sql<User>('select id from users where id = $1', [result.id]);

    if (userRes.rowCount === 0) return response.status(401).json({ message: 'Unauthorized' });

    request.userId = userRes.rows[0].id;

    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError && 'code' in err) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    return response.status(500).json({ message: 'Something went wrong' });
  }
}

/**
 * Middleware to ensure that the user is activated.
 * * This middleware must always be invoked after `isAuthenticated`
 */
export async function isActivated(request: Request, response: Response, next: NextFunction) {
  try {
    const userRes = await sql<User>('select activated from users where id = $1', [request.userId]);

    const user = userRes.rows[0];

    if (!user.activated) return response.status(401).json({ message: 'Unauthorized' });

    next();
  } catch (err) {
    return response.status(500).json({ message: 'Something went wrong' });
  }
}
