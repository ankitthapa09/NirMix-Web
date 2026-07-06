import { Router } from 'express';
import visitController from '../controllers/visit.controller.js';
import { verifyAccessToken, isAuthenticated, optionalAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * GET /api/visits/received
 * Visit requests on the authenticated owner's properties
 * Headers: Authorization: Bearer <accessToken>
 */
router.get(
  '/received',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(visitController.getReceived.bind(visitController))
);

/**
 * POST /api/visits
 * Schedule a visit for a property (public)
 * Body: { propertyId, date, slot, name, phone, email?, message? }
 */
router.post('/', optionalAuth, asyncHandler(visitController.create.bind(visitController)));

/**
 * PATCH /api/visits/:id/status
 * Confirm / cancel / complete a visit request (property owner only)
 * Headers: Authorization: Bearer <accessToken>
 * Body: { status }
 */
router.patch(
  '/:id/status',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(visitController.updateStatus.bind(visitController))
);

export default router;
