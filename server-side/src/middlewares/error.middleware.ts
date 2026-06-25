import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Global Error Handler Middleware
 * Must be registered last in the Express app
 */
export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error values
  let statusCode: number = HTTP_STATUS.INTERNAL;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle ApiError (expected errors)
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }
  // Handle Mongoose Cast Error (invalid ObjectId)
  else if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
    isOperational = true;
  }
  // Handle Mongoose Validation Error
  else if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation Error';
    isOperational = true;
  }
  // Handle Mongoose Duplicate Key Error
  else if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    statusCode = HTTP_STATUS.CONFLICT;
    message = `${field} already exists`;
    isOperational = true;
  }
  // Handle JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
    isOperational = true;
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
    isOperational = true;
  }
  // Log unexpected errors
  else {
    console.error('Unexpected error:', error);
  }

  // Send error response
  res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      null,
      message
    )
  );
};

/**
 * Async Route Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Middleware
 * Should be registered before error handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const statusCode = HTTP_STATUS.NOT_FOUND;
  const message = `Route ${req.originalUrl} not found`;
  
  res.status(statusCode).json(
    new ApiResponse(statusCode, null, message)
  );
};
