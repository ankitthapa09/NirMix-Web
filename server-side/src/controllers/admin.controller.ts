import { Request, Response, NextFunction } from 'express';
import adminService from '../services/admin.service.js';
import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  setVerificationSchema,
  setActiveSchema,
} from '../types/admin.types.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

function firstIssue(error: { issues: { path: (string | number | symbol)[]; message: string }[] }): string {
  const issue = error.issues[0];
  const path = issue.path.join('.');
  return path ? `${path}: ${issue.message}` : issue.message;
}

class AdminController {
  /**
   * GET /api/admin/users
   * Paginated, filterable user list (admin only).
   * Query: page, limit, search, role, isVerified, isActive
   */
  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = listUsersQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const result = await adminService.listUsers(validation.data);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Users fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users/:id
   * A single user including citizenshipNo, for identity review (admin only).
   */
  async getUserForReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await adminService.getUserForReview(String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'User fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/users/:id/role
   * Change a user's role (admin only). Body: { role }
   */
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actingAdminId = req.user?.id;
      if (!actingAdminId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const validation = updateUserRoleSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const user = await adminService.updateUserRole(
        actingAdminId,
        String(req.params.id),
        validation.data
      );

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'User role updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/users/:id/verification
   * Approve or revoke identity verification (admin only). Body: { isVerified }
   */
  async setVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = setVerificationSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const user = await adminService.setUserVerification(
        String(req.params.id),
        validation.data
      );

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'User verification updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/users/:id/active
   * Suspend or reactivate an account (admin only). Body: { isActive }
   */
  async setActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actingAdminId = req.user?.id;
      if (!actingAdminId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const validation = setActiveSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const user = await adminService.setUserActive(
        actingAdminId,
        String(req.params.id),
        validation.data
      );

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, user, 'User account status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
