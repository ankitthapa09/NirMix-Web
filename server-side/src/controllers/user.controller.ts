import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class UserController {
  /**
   * PATCH /api/users/me/avatar
   * Update the authenticated user's profile picture.
   * Body: multipart/form-data with an `avatar` image file.
   */
  async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      if (!req.file) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No avatar image provided');
      }

      const user = await userService.updateAvatar(userId, req.file);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'Profile picture updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/me/avatar
   * Remove the authenticated user's profile picture.
   */
  async removeAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      const user = await userService.removeAvatar(userId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'Profile picture removed')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/me/password
   * Change the authenticated user's password.
   * Body: { currentPassword, newPassword }
   */
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      const { currentPassword, newPassword } = req.body as {
        currentPassword?: string;
        newPassword?: string;
      };

      if (!currentPassword || !newPassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Current and new password are required');
      }
      if (newPassword.length < 8) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'New password must be at least 8 characters');
      }
      if (currentPassword === newPassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'New password must be different from the current one');
      }

      await userService.changePassword(userId, currentPassword, newPassword);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Password updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/saved
   * List the authenticated user's saved properties.
   */
  async getSaved(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const properties = await userService.getSavedProperties(userId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, properties, 'Saved properties fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/me/saved/:propertyId
   * Save (bookmark) a property.
   */
  async saveProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      await userService.saveProperty(userId, String(req.params.propertyId));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Property saved')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/me/saved/:propertyId
   * Remove a property from the saved list.
   */
  async unsaveProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      await userService.unsaveProperty(userId, String(req.params.propertyId));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Property removed from saved')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
