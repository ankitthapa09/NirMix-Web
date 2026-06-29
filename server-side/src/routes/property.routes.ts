import { Router } from 'express';
import propertyController from '../controllers/property.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadPropertyMedia } from '../middlewares/upload.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

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

export default router;
