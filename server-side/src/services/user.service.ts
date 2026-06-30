import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { updateUser } from '../repositories/user.repository.js';
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
}

export default new UserService();
