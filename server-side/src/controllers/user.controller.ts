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
}

export default new UserController();
