import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import { findUserById } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { IJwtPayload } from '../types/auth.types.js';
import { USER_ROLES, UserRole } from '../constants/userRoles.js';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

/**
 * Middleware to verify JWT access token
 * Attaches decoded token payload to req.user
 */
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'No access token provided');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = authService.verifyAccessToken(token);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify JWT refresh token
 * Used when refreshing access tokens
 */
export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get refresh token from body (cookie-parser not installed, use body instead)
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'No refresh token provided');
    }

    // Verify token
    const decoded = authService.verifyRefreshToken(refreshToken);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is authenticated
 * Must be used after verifyAccessToken middleware
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated'));
  }
  next();
};

/**
 * Role-gate factory. Returns middleware that allows the request through only if
 * the caller's *current* role (looked up fresh, not read from the token) is one
 * of `allowedRoles`. A fresh lookup means a demoted or suspended admin loses
 * access on their next request rather than when their token expires.
 * Must be used after verifyAccessToken middleware.
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      const user = await findUserById(req.user.id);
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found');
      }
      if (!user.isActive) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account is deactivated');
      }
      if (!allowedRoles.includes(user.role)) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user is admin.
 * Must be used after verifyAccessToken middleware.
 */
export const isAdmin = requireRole(USER_ROLES.ADMIN);

/**
 * Optional Auth Middleware
 * Does not throw error if no token, just sets req.user if token exists
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Silently fail and continue
    next();
  }
};
