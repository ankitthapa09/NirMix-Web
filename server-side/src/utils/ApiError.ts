import { HTTP_STATUS } from '../constants/httpStatus';
 
export class ApiError extends Error {
  statusCode:    number;
  isOperational: boolean;
 
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
 
  static badRequest(message: string): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }
 
  static unauthorized(message = 'Please log in to continue'): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }
 
  static forbidden(message = 'You do not have permission to do this'): ApiError {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }
 
  static notFound(resource = 'Resource'): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, `${resource} not found`);
  }
 
  static conflict(message: string): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }
}
