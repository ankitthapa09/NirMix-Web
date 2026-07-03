import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import portfolioService, { PortfolioMediaFiles } from '../services/portfolio.service.js';
import { createPortfolioSchema, updatePortfolioSchema } from '../types/portfolio.types.js';
import { ALL_Portfolio_ROLES, PortfolioRole } from '../constants/portfolioRoles.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/** Parse and zod-validate the multipart `data` JSON field. */
function parseData<T>(rawData: unknown, schema: z.ZodType<T>): T {
  if (!rawData || typeof rawData !== 'string') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Missing "data" field in request');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid JSON in "data" field');
  }
  const validation = schema.safeParse(parsed);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    const path = issue.path.join('.');
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, path ? `${path}: ${issue.message}` : issue.message);
  }
  return validation.data;
}

class PortfolioController {
  /**
   * POST /api/portfolios
   * Create the authenticated user's portfolio.
   * Body: multipart/form-data with a `data` JSON field + optional coverImage + projectImages[].
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const data = parseData(req.body?.data, createPortfolioSchema);
      const files = (req.files ?? {}) as PortfolioMediaFiles;

      const portfolio = await portfolioService.createPortfolio(ownerId, data, files);

      res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, portfolio, 'Portfolio created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/portfolios/me
   * The authenticated user's own portfolio (data is null if they have none yet).
   */
  async getMyPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const portfolio = await portfolioService.getMyPortfolio(ownerId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, portfolio, 'Portfolio fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/portfolios?category=engineer
   * List active portfolios (public), optionally filtered by category.
   */
  async listPortfolios(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const raw = req.query.category;
      const category =
        typeof raw === 'string' && (ALL_Portfolio_ROLES as string[]).includes(raw)
          ? (raw as PortfolioRole)
          : undefined;

      const portfolios = await portfolioService.getAllPortfolios(category);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, portfolios, 'Portfolios fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/portfolios/:id
   * A single portfolio (public), owner populated.
   */
  async getPortfolioById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const portfolio = await portfolioService.getPortfolioById(String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, portfolio, 'Portfolio fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/portfolios/:id
   * Update the authenticated user's portfolio.
   * Body: multipart/form-data with a `data` JSON field + new coverImage + projectImages[].
   */
  async updatePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      const data = parseData(req.body?.data, updatePortfolioSchema);
      const files = (req.files ?? {}) as PortfolioMediaFiles;

      const portfolio = await portfolioService.updatePortfolio(
        ownerId,
        String(req.params.id),
        data,
        files
      );

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, portfolio, 'Portfolio updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/portfolios/:id
   * Delete the authenticated user's portfolio.
   */
  async deletePortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');

      await portfolioService.deletePortfolio(ownerId, String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Portfolio deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PortfolioController();
