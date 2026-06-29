import { Request, Response, NextFunction } from 'express';
import propertyService, { PropertyMediaFiles } from '../services/property.service.js';
import { createPropertySchema } from '../types/property.types.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

class PropertyController {
  /**
   * POST /api/properties
   * Create a new property listing (requires authentication).
   * Body: multipart/form-data with a `data` JSON field + photos[] + optional floorPlan.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      // Non-file fields travel as a single JSON string in the `data` field.
      const rawData = req.body?.data;
      if (!rawData) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Missing "data" field in request');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawData);
      } catch {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid JSON in "data" field');
      }

      const validation = createPropertySchema.safeParse(parsed);
      if (!validation.success) {
        const issue = validation.error.issues[0];
        const path = issue.path.join('.');
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          path ? `${path}: ${issue.message}` : issue.message
        );
      }

      const files = (req.files ?? {}) as PropertyMediaFiles;

      const property = await propertyService.createListing(ownerId, validation.data, files);

      res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, property, 'Property listed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/properties/me
   * Get all listings owned by the authenticated user.
   */
  async getMyListings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      const properties = await propertyService.getMyListings(ownerId);

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, properties, 'Listings fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/properties/:id
   * Get a single listing (public).
   */
  async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await propertyService.getListingById(String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, property, 'Property fetched successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/properties/:id
   * Delete a listing the authenticated user owns.
   */
  async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.user?.id;
      if (!ownerId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
      }

      await propertyService.deleteListing(ownerId, String(req.params.id));

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'Listing deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
