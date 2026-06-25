import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { name, email, password, contact }
 */
router.post('/register', asyncHandler(authController.register.bind(authController)));

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 * Returns: { user, accessToken, refreshToken }
 */
router.post('/login', asyncHandler(authController.login.bind(authController)));

/**
 * POST /api/auth/refresh
 * Refresh access token
 * Body: { refreshToken } or Cookie: { refreshToken }
 * Returns: { accessToken, refreshToken }
 */
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));

/**
 * POST /api/auth/logout
 * Logout user (requires authentication)
 * Headers: Authorization: Bearer <accessToken>
 */
router.post('/logout', verifyAccessToken, isAuthenticated, asyncHandler(authController.logout.bind(authController)));

export default router;
