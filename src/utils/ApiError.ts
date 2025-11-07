import { StatusCodes } from 'http-status-codes';

/**
 * Custom API error class for handling application errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: any,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Factory methods for common error types
  static badRequest(message: string, details?: any): ApiError {
    return new ApiError(StatusCodes.BAD_REQUEST, message, true, details);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(StatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(StatusCodes.FORBIDDEN, message);
  }

  static notFound(message = 'Not Found'): ApiError {
    return new ApiError(StatusCodes.NOT_FOUND, message);
  }

  static conflict(message: string, details?: any): ApiError {
    return new ApiError(StatusCodes.CONFLICT, message, true, details);
  }

  static validationError(message = 'Validation Error', details?: any): ApiError {
    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, message, true, details);
  }

  static internal(message = 'Internal Server Error', details?: any): ApiError {
    return new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      message,
      false, // Not operational by default
      details
    );
  }

  static fromError(error: Error, statusCode = StatusCodes.INTERNAL_SERVER_ERROR): ApiError {
    const apiError = new ApiError(
      statusCode,
      error.message,
      false,
      undefined,
      error.stack
    );
    return apiError;
  }
}

export default ApiError;
