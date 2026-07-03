import { Router } from 'express';
import portfolioController from '../controllers/portfolio.controller.js';
import { verifyAccessToken, isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadPortfolioMedia } from '../middlewares/upload.middleware.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * GET /api/portfolios/me
 * Get the authenticated user's own portfolio (data is null if none yet)
 * Headers: Authorization: Bearer <accessToken>
 */
router.get(
  '/me',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(portfolioController.getMyPortfolio.bind(portfolioController))
);

/**
 * POST /api/portfolios
 * Create the authenticated user's portfolio
 * Headers: Authorization: Bearer <accessToken>
 * Body: multipart/form-data — data (JSON), coverImage (optional), projectImages[]
 */
router.post(
  '/',
  verifyAccessToken,
  isAuthenticated,
  uploadPortfolioMedia,
  asyncHandler(portfolioController.create.bind(portfolioController))
);

/**
 * GET /api/portfolios?category=engineer
 * List active portfolios (public), optionally filtered by category
 */
router.get('/', asyncHandler(portfolioController.listPortfolios.bind(portfolioController)));

/**
 * GET /api/portfolios/:id
 * Get a single portfolio (public)
 */
router.get('/:id', asyncHandler(portfolioController.getPortfolioById.bind(portfolioController)));

/**
 * PATCH /api/portfolios/:id
 * Update the authenticated user's portfolio
 * Headers: Authorization: Bearer <accessToken>
 * Body: multipart/form-data — data (JSON), new coverImage, new projectImages[]
 */
router.patch(
  '/:id',
  verifyAccessToken,
  isAuthenticated,
  uploadPortfolioMedia,
  asyncHandler(portfolioController.updatePortfolio.bind(portfolioController))
);

/**
 * DELETE /api/portfolios/:id
 * Delete the authenticated user's portfolio
 * Headers: Authorization: Bearer <accessToken>
 */
router.delete(
  '/:id',
  verifyAccessToken,
  isAuthenticated,
  asyncHandler(portfolioController.deletePortfolio.bind(portfolioController))
);

export default router;
