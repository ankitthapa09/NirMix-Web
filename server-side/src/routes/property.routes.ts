import { Router } from 'express';
import propertyController from '../controllers/property.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadPropertyMedia } from '../middlewares/upload.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * GET /api/properties/me
 * Get the authenticated user's own listings
 * Headers: Authorization: Bearer <accessToken>
 */
router.get(
  '/me',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(propertyController.getMyListings.bind(propertyController))
);

/**
 * POST /api/properties
 * Create a property listing (requires authentication)
 * Headers: Authorization: Bearer <accessToken>
 * Body: multipart/form-data — data (JSON), photos[] (1-12 images), floorPlan (optional)
 */
router.post(
  '/',
  verifyAccessToken,
  isAuthenticated,
  uploadPropertyMedia,
  asyncHandler(propertyController.create.bind(propertyController))
);

/**
 * GET /api/properties
 * List all active listings (public)
 */
router.get('/', asyncHandler(propertyController.listProperties.bind(propertyController)));

/**
 * GET /api/properties/:id
 * Get a single listing (public)
 */
router.get('/:id', asyncHandler(propertyController.getPropertyById.bind(propertyController)));

/**
 * PATCH /api/properties/:id
 * Update a listing owned by the authenticated user
 * Headers: Authorization: Bearer <accessToken>
 * Body: multipart/form-data — data (JSON), new photos[], optional floorPlan
 */
router.patch(
  '/:id',
  verifyAccessToken,
  isAuthenticated,
  uploadPropertyMedia,
  asyncHandler(propertyController.updateProperty.bind(propertyController))
);

/**
 * DELETE /api/properties/:id
 * Delete a listing owned by the authenticated user
 * Headers: Authorization: Bearer <accessToken>
 */
router.delete(
  '/:id',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(propertyController.deleteProperty.bind(propertyController))
);

export default router;
