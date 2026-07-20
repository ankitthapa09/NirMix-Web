import { Router } from 'express';
import notificationController from '../controllers/notification.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

// Every notification route is scoped to the authenticated recipient.
router.use(verifyAccessToken, isAuthenticated);

/**
 * GET /api/notifications
 * The caller's notifications + unread count
 */
router.get('/', asyncHandler(notificationController.list.bind(notificationController)));

/**
 * PATCH /api/notifications/read-all
 * Mark every unread notification as read
 */
router.patch(
  '/read-all',
  asyncHandler(notificationController.markAllRead.bind(notificationController))
);

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
router.patch(
  '/:id/read',
  asyncHandler(notificationController.markRead.bind(notificationController))
);

/**
 * DELETE /api/notifications/:id
 * Remove a notification
 */
router.delete('/:id', asyncHandler(notificationController.remove.bind(notificationController)));

export default router;
