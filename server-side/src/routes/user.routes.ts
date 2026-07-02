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

export default router;
