import { Router } from 'express';
import reviewController from '../controllers/review.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * GET /api/reviews/property/:propertyId
 * A property's reviews + aggregate summary (public)
 */
router.get(
  '/property/:propertyId',
  asyncHandler(reviewController.getForProperty.bind(reviewController))
);

/**
 * POST /api/reviews
 * Create or update the caller's review for a property
 * Headers: Authorization: Bearer <accessToken>
 * Body: { propertyId, rating, comment }
 */
router.post(
  '/',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(reviewController.create.bind(reviewController))
);

/**
 * DELETE /api/reviews/:id
 * Delete the caller's own review
 * Headers: Authorization: Bearer <accessToken>
 */
router.delete(
  '/:id',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(reviewController.remove.bind(reviewController))
);

export default router;
