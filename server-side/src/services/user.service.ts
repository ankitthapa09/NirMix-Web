import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import {
  updateUser, findUserById, findUserById_WithPassword,
  addSavedProperty, removeSavedProperty, findSavedProperties,
} from '../repositories/user.repository.js';
import { findPropertyById } from '../repositories/property.repository.js';
import { IProperty } from '../models/propertyModel.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Sanitized user returned to the client (matches the auth login response shape).
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  contact: string;
  avatar?: string;
  isEmailVerified: boolean;
}

class UserService {
  /**
   * Upload the avatar to Cloudinary under a per-user public_id so a new upload
   * overwrites the previous one (no orphaned images). Returns the secure URL.
   */
  private uploadAvatarImage(file: Express.Multer.File, userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nirmix/avatars',
          public_id: userId,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error ?? new ApiError(HTTP_STATUS.INTERNAL, 'Avatar upload failed'));
          }
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  /**
   * Update the authenticated user's profile picture.
   */
  async updateAvatar(userId: string, file: Express.Multer.File): Promise<SafeUser> {
    const avatarUrl = await this.uploadAvatarImage(file, userId);

    const user = await updateUser(userId, { avatar: avatarUrl });
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      contact: user.contact,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    };
  }

  /**
   * Remove the authenticated user's profile picture (Cloudinary + DB).
   */
  async removeAvatar(userId: string): Promise<SafeUser> {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    if (user.avatar) {
      // Avatars are stored at nirmix/avatars/<userId> (per-user public_id).
      await cloudinary.uploader.destroy(`nirmix/avatars/${userId}`).catch(() => undefined);
    }

    const updated = await updateUser(userId, { avatar: '' });
    if (!updated) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return {
      id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      contact: updated.contact,
      avatar: updated.avatar,
      isEmailVerified: updated.isEmailVerified,
    };
  }

  /**
   * Change the authenticated user's password after verifying the current one.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await findUserById_WithPassword(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
    }

    // Assigning triggers the schema's pre-save hook, which hashes the password.
    user.password = newPassword;
    await user.save();
  }

  /**
   * Save (bookmark) a property for the authenticated user. Idempotent.
   */
  async saveProperty(userId: string, propertyId: string): Promise<void> {
    const property = await findPropertyById(propertyId);
    if (!property) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Property not found');
    }
    await addSavedProperty(userId, propertyId);
  }

  /**
   * Remove a property from the user's saved list. Idempotent.
   */
  async unsaveProperty(userId: string, propertyId: string): Promise<void> {
    await removeSavedProperty(userId, propertyId);
  }

  /**
   * The user's saved properties (populated). Skips any that were since deleted.
   */
  async getSavedProperties(userId: string): Promise<IProperty[]> {
    const user = await findSavedProperties(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return (user.savedProperties as unknown as (IProperty | null)[]).filter(
      (p): p is IProperty => p !== null
    );
  }
}

export default new UserService();
