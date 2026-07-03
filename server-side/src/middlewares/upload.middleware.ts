import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Keep files in memory; the service streams the buffers to Cloudinary.
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.fieldname === 'photos') {
    // Property photos must be images.
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Photos must be image files'));
  }

  if (file.fieldname === 'floorPlan') {
    // Floor plan may be an image or a PDF.
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Floor plan must be an image or PDF'));
  }

  if (file.fieldname === 'avatar') {
    // Profile picture must be an image.
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Avatar must be an image file'));
  }

  if (file.fieldname === 'coverImage' || file.fieldname === 'projectImages') {
    // Portfolio cover and project work samples must be images.
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Portfolio images must be image files'));
  }

  return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, `Unexpected file field: ${file.fieldname}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file (matches server.ts body limit)
    files: 32,                  // covers property (12+1) and portfolio (1 cover + 30 work images)
  },
});

// Accepts: photos[] (max 12), floorPlan (max 1), and any text fields (e.g. `data`).
export const uploadPropertyMedia = upload.fields([
  { name: 'photos', maxCount: 12 },
  { name: 'floorPlan', maxCount: 1 },
]);

// Accepts a single `avatar` image file for profile picture uploads.
export const uploadAvatar = upload.single('avatar');

// Accepts: coverImage (max 1), projectImages[] (max 30), and text fields (e.g. `data`).
export const uploadPortfolioMedia = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'projectImages', maxCount: 30 },
]);
