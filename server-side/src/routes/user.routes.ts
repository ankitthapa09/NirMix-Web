import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * PATCH /api/users/me/avatar
 * Update the authenticated user's profile picture
 * Headers: Authorization: Bearer <accessToken>
 * Body: multipart/form-data — avatar (image file)
 */
router.patch(
  '/me/avatar',
  verifyAccessToken,
  isAuthenticated,
  uploadAvatar,
  asyncHandler(userController.updateAvatar.bind(userController))
);

/**
 * DELETE /api/users/me/avatar
 * Remove the authenticated user's profile picture
 * Headers: Authorization: Bearer <accessToken>
 */
router.delete(
  '/me/avatar',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(userController.removeAvatar.bind(userController))
);

/**
 * PATCH /api/users/me/password
 * Change the authenticated user's password
 * Headers: Authorization: Bearer <accessToken>
 * Body: { currentPassword, newPassword }
 */
router.patch(
  '/me/password',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(userController.changePassword.bind(userController))
);

/**
 * GET /api/users/me/saved
 * List the authenticated user's saved properties
 */
router.get(
  '/me/saved',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(userController.getSaved.bind(userController))
);

/**
 * POST /api/users/me/saved/:propertyId
 * Save (bookmark) a property
 */
router.post(
  '/me/saved/:propertyId',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(userController.saveProperty.bind(userController))
);

/**
 * DELETE /api/users/me/saved/:propertyId
 * Remove a property from the saved list
 */
router.delete(
  '/me/saved/:propertyId',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(userController.unsaveProperty.bind(userController))
);

export default router;
