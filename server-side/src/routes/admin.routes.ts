import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';
import { verifyAccessToken, isAdmin } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

// Every admin route requires a valid access token AND an admin role.
router.use(verifyAccessToken, isAdmin);

/**
 * GET /api/admin/users
 * Paginated, filterable user list.
 * Query: page, limit, search, role, isVerified, isActive
 */
router.get('/users', asyncHandler(adminController.listUsers.bind(adminController)));

/**
 * GET /api/admin/users/:id
 * A single user including citizenshipNo, for identity review.
 */
router.get('/users/:id', asyncHandler(adminController.getUserForReview.bind(adminController)));

/**
 * PATCH /api/admin/users/:id/role
 * Change a user's role. Body: { role }
 */
router.patch('/users/:id/role', asyncHandler(adminController.updateUserRole.bind(adminController)));

/**
 * PATCH /api/admin/users/:id/verification
 * Approve or revoke identity verification. Body: { isVerified }
 */
router.patch(
  '/users/:id/verification',
  asyncHandler(adminController.setVerification.bind(adminController))
);

/**
 * PATCH /api/admin/users/:id/active
 * Suspend or reactivate an account. Body: { isActive }
 */
router.patch('/users/:id/active', asyncHandler(adminController.setActive.bind(adminController)));

export default router;
