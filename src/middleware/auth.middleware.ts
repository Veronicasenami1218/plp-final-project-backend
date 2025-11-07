import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types';
import { JWT_SECRET } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    sessionId?: string;
  };
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: UserRole;
      sessionId?: string;
    };

    // Attach user to request object
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token expired'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check if user has required roles
 */
export const authorize = (roles: UserRole[] = []) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('User not authenticated');
      }

      // If no roles specified, any authenticated user can access
      if (roles.length === 0) {
        return next();
      }

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        throw ApiError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if the request is from an anonymous user
 */
export const checkAnonymousAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // If user is authenticated, check if they're trying to access anonymous-only routes
    if (req.user) {
      throw ApiError.badRequest('Authenticated users cannot access this resource');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  authorize,
  checkAnonymousAccess,
};
