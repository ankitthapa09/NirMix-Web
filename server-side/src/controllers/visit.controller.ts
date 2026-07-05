import { Request, Response, NextFunction } from 'express';
import visitService from '../services/visit.service.js';
import { createVisitSchema, updateVisitStatusSchema } from '../types/visit.types.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

function firstIssue(error: { issues: { path: (string | number | symbol)[]; message: string }[] }): string {
  const issue = error.issues[0];
  const path = issue.path.join('.');
  return path ? `${path}: ${issue.message}` : issue.message;
}

class VisitController {
  /**
   * POST /api/visits
   * Schedule a visit for a property (public — no auth required).
   * Body: { propertyId, date, slot, name, phone, email?, message? }
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = createVisitSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      // If a token happened to be attached, link the requester; otherwise anonymous.
      const visit = await visitService.scheduleVisit(validation.data, req.user?.id);

      res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, visit, 'Visit requested successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/visits/received
   * Visit requests on the authenticated owner's properties.
   */
  async getReceived(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const visits = await visitService.getReceivedVisits(ownerId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, visits, 'Visit requests fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/visits/:id/status
   * Confirm / cancel / complete a visit request (property owner only).
   * Body: { status }
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const validation = updateVisitStatusSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const visit = await visitService.updateStatus(ownerId, String(req.params.id), validation.data.status);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, visit, 'Visit updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new VisitController();
