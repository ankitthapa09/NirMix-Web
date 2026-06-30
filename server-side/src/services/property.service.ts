import { Types } from 'mongoose';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import {
  createProperty,
  findPropertiesByOwner,
  findActiveProperties,
  findPropertyById,
  findPropertyByIdWithOwner,
  deletePropertyById,
} from '../repositories/property.repository.js';
import { updateUser } from '../repositories/user.repository.js';
import { getNextSequence } from '../repositories/counter.repository.js';
import { IProperty } from '../models/propertyModel.js';
import {
  CreatePropertyInput,
  IPropertyMedia,
  buildReferenceId,
  referenceKey,
} from '../types/property.types.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Shape of req.files produced by upload.middleware's `.fields()` config.
export interface PropertyMediaFiles {
  photos?: Express.Multer.File[];
  floorPlan?: Express.Multer.File[];
}

class PropertyService {
  /**
   * Stream a single in-memory file buffer to Cloudinary.
   * `resource_type: 'auto'` covers both images and PDF floor plans.
   */
  private uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<IPropertyMedia> {
    return new Promise<IPropertyMedia>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error ?? new ApiError(HTTP_STATUS.INTERNAL, 'Image upload failed'));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(file.buffer);
    });
  }

  /**
   * Create a property listing: upload media to Cloudinary, persist the document,
   * and mark the owner as having posted a property.
   */
  async createListing(
    ownerId: string,
    data: CreatePropertyInput,
    files: PropertyMediaFiles
  ): Promise<IProperty> {
    const photoFiles = files.photos ?? [];
    if (photoFiles.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'At least one property photo is required');
    }

    // Upload all photos in parallel.
    const photos = await Promise.all(
      photoFiles.map((file) => this.uploadToCloudinary(file, 'nirmix/properties'))
    );

    // Floor plan is optional.
    let floorPlan: IPropertyMedia | undefined;
    const floorPlanFile = files.floorPlan?.[0];
    if (floorPlanFile) {
      floorPlan = await this.uploadToCloudinary(floorPlanFile, 'nirmix/floor-plans');
    }

    // Reference code, sequenced per listing+category combination (e.g. SALE-LAND-0001).
    const seq = await getNextSequence(referenceKey(data.listingType, data.propertyType));
    const referenceId = buildReferenceId(data.listingType, data.propertyType, seq);

    const property = await createProperty({
      referenceId,
      owner: new Types.ObjectId(ownerId),
      listingType: data.listingType,
      propertyType: data.propertyType,
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      videoLink: data.videoLink,
      details: data.details,
      photos,
      floorPlan,
    });

    // Flag the user so the dashboard knows they have at least one listing.
    await updateUser(ownerId, { hasPostedProperty: true });

    return property;
  }

  /**
   * Get all listings owned by the authenticated user.
   */
  async getMyListings(ownerId: string): Promise<IProperty[]> {
    return findPropertiesByOwner(ownerId);
  }

  /**
   * Get all active listings for the public browse pages.
   */
  async getAllListings(): Promise<IProperty[]> {
    return findActiveProperties();
  }

  /**
   * Get a single listing by id (public), with the owner populated.
   */
  async getListingById(id: string): Promise<IProperty> {
    const property = await findPropertyByIdWithOwner(id);
    if (!property) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    }
    return property;
  }

  /**
   * Delete a listing the user owns, removing its Cloudinary media too.
   */
  async deleteListing(ownerId: string, propertyId: string): Promise<void> {
    const property = await findPropertyById(propertyId);
    if (!property) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    }
    if (property.owner.toString() !== ownerId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own listings');
    }

    // Best-effort removal of media from Cloudinary so deletes don't leave orphans.
    const publicIds = [
      ...property.photos.map((p) => p.publicId),
      ...(property.floorPlan ? [property.floorPlan.publicId] : []),
    ];
    await Promise.all(
      publicIds.map((id) => cloudinary.uploader.destroy(id).catch(() => undefined))
    );

    await deletePropertyById(propertyId);
  }
}

export default new PropertyService();
