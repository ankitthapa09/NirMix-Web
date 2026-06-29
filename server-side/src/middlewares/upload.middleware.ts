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

  return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, `Unexpected file field: ${file.fieldname}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file (matches server.ts body limit)
    files: 13,                  // up to 12 photos + 1 floor plan
  },
});

// Accepts: photos[] (max 12), floorPlan (max 1), and any text fields (e.g. `data`).
export const uploadPropertyMedia = upload.fields([
  { name: 'photos', maxCount: 12 },
  { name: 'floorPlan', maxCount: 1 },
]);
