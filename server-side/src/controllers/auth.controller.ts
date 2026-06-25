import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/httpStatus';
import { IRegisterRequest, ILoginRequest } from '../types/auth.types';

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, contact } = req.body as IRegisterRequest;

      // Basic validation
      if (!name || !email || !password || !contact) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Missing required fields: name, email, password, contact');
      }

      if (password.length < 8) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Password must be at least 8 characters');
      }

      // Call auth service
      const result = await authService.register({
        name,
        email,
        password,
        contact,
      });

      res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user with email and password
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as ILoginRequest;

      // Basic validation
      if (!email || !password) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email and password are required');
      }

      // Call auth service
      const result = await authService.login({
        email,
        password,
      });

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is required');
      }

      const tokens = await authService.refreshAccessToken(refreshToken);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, tokens, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      await authService.logout(userId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
