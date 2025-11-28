import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { UnauthorizedError } from '../errors';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header is required',
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Invalid authorization format. Use: Bearer <token>',
      });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }
  } catch (error: unknown) {
    next(error);
  }
};

