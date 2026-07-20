import { Request, Response, NextFunction } from 'express';
import reviewService from '../services/review.service.js';
import { createReviewSchema } from '../types/review.types.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

function firstIssue(error: { issues: { path: (string | number | symbol)[]; message: string }[] }): string {
  const issue = error.issues[0];
  const path = issue.path.join('.');
  return path ? `${path}: ${issue.message}` : issue.message;
}

class ReviewController {
  /**
   * POST /api/reviews
   * Create or update the caller's review for a property (auth required).
   * Body: { propertyId, rating, comment }
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.id;
      if (!authorId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const validation = createReviewSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, firstIssue(validation.error));
      }

      const review = await reviewService.submitReview(authorId, validation.data);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, review, 'Review submitted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reviews/property/:propertyId
   * A property's reviews plus an aggregate summary (public).
   */
  async getForProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await reviewService.getPropertyReviews(String(req.params.propertyId));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Reviews fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/reviews/:id
   * Delete the caller's own review (auth required).
   */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorId = req.user?.id;
      if (!authorId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      await reviewService.deleteReview(authorId, String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Review deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
