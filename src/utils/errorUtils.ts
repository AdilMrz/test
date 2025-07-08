import type {
  AppError,
  ErrorContext,
  ErrorSeverity,
  ErrorCode,
} from "../types/errors";
import { ERROR_CODES } from "../types/errors";

/**
 * Creates a standardized AppError with context
 */
export const createAppError = (
  message: string,
  code?: ErrorCode,
  status?: number,
  context?: ErrorContext,
): AppError => {
  const error = new Error(message) as AppError;
  error.code = code;
  error.status = status;
  error.timestamp = new Date();
  error.userId = context?.userId;
  error.resource = context?.resource;
  error.action = context?.action;
  error.details = context?.metadata;
  return error;
};

/**
 * Determines error severity based on error properties
 */
export const getErrorSeverity = (error: AppError): ErrorSeverity => {
  if (error.code === ERROR_CODES.INTERNAL_ERROR || error.status === 500) {
    return "critical";
  }

  if (error.code === ERROR_CODES.SERVICE_UNAVAILABLE || error.status === 503) {
    return "high";
  }

  if (
    error.code === ERROR_CODES.UNAUTHORIZED ||
    error.code === ERROR_CODES.FORBIDDEN ||
    error.status === 401 ||
    error.status === 403
  ) {
    return "medium";
  }

  if (
    error.code === ERROR_CODES.VALIDATION_ERROR ||
    error.code === ERROR_CODES.CONSTRAINT_VIOLATION ||
    error.status === 400
  ) {
    return "low";
  }

  return "medium";
};

/**
 * Converts various error types to AppError
 */
export const normalizeError = (
  error: unknown,
  context?: ErrorContext,
): AppError => {
  if (error instanceof Error) {
    const appError = error as AppError;
    if (!appError.timestamp) appError.timestamp = new Date();
    if (context?.userId && !appError.userId) appError.userId = context.userId;
    if (context?.resource && !appError.resource)
      appError.resource = context.resource;
    if (context?.action && !appError.action) appError.action = context.action;
    return appError;
  }

  if (typeof error === "string") {
    return createAppError(error, undefined, undefined, context);
  }

  if (typeof error === "object" && error !== null) {
    const errorObj = error as {
      message?: string;
      code?: string;
      status?: number;
    };
    return createAppError(
      errorObj.message || "Unknown error",
      errorObj.code as ErrorCode | undefined,
      errorObj.status,
      context,
    );
  }

  return createAppError(
    "Unknown error occurred",
    ERROR_CODES.INTERNAL_ERROR,
    500,
    context,
  );
};

/**
 * Checks if an error is retryable
 */
export const isRetryableError = (error: AppError): boolean => {
  const retryableCodes: ErrorCode[] = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.CONNECTION_LOST,
    ERROR_CODES.SERVICE_UNAVAILABLE,
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
  ];

  const retryableStatuses = [408, 429, 500, 502, 503, 504];

  return (
    Boolean(error.code && retryableCodes.includes(error.code as ErrorCode)) ||
    Boolean(error.status && retryableStatuses.includes(error.status))
  );
};

/**
 * Gets user-friendly error message
 */
export const getUserFriendlyMessage = (error: AppError): string => {
  const codeMessages: Record<string, string> = {
    [ERROR_CODES.NETWORK_ERROR]:
      "Network connection failed. Please check your internet connection.",
    [ERROR_CODES.TIMEOUT_ERROR]: "Request timed out. Please try again.",
    [ERROR_CODES.CONNECTION_LOST]:
      "Connection lost. Please check your internet connection.",
    [ERROR_CODES.UNAUTHORIZED]:
      "You are not authorized to perform this action.",
    [ERROR_CODES.SESSION_EXPIRED]:
      "Your session has expired. Please log in again.",
    [ERROR_CODES.FORBIDDEN]:
      "You do not have permission to perform this action.",
    [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
    [ERROR_CODES.CONSTRAINT_VIOLATION]:
      "This operation violates data constraints.",
    [ERROR_CODES.FOREIGN_KEY_VIOLATION]:
      "Cannot delete item that is referenced by other records.",
    [ERROR_CODES.UNIQUE_VIOLATION]:
      "This value already exists. Please use a different value.",
    [ERROR_CODES.RESOURCE_NOT_FOUND]: "The requested item was not found.",
    [ERROR_CODES.SERVICE_UNAVAILABLE]:
      "Service is temporarily unavailable. Please try again later.",
    [ERROR_CODES.RATE_LIMIT_EXCEEDED]:
      "Too many requests. Please wait a moment and try again.",
  };

  if (error.code && codeMessages[error.code]) {
    return codeMessages[error.code];
  }

  // Status-based messages
  if (error.status) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Access denied. You do not have permission.";
      case 404:
        return "The requested item was not found.";
      case 409:
        return "Conflict detected. Please refresh and try again.";
      case 422:
        return "Invalid data provided. Please check your input.";
      case 429:
        return "Too many requests. Please wait and try again.";
      case 500:
        return "Internal server error. Please try again later.";
      case 502:
        return "Service temporarily unavailable. Please try again.";
      case 503:
        return "Service maintenance in progress. Please try again later.";
      case 504:
        return "Request timeout. Please try again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  return error.message || "An unexpected error occurred. Please try again.";
};

/**
 * Parses Supabase errors and converts them to AppError
 */
export const parseSupabaseError = (
  error: unknown,
  context?: ErrorContext,
): AppError => {
  if (!error) {
    return createAppError(
      "Unknown database error",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      context,
    );
  }

  const supabaseError = error as {
    message?: string;
    code?: string;
    status?: number;
  };

  // Handle Supabase auth errors
  if (supabaseError.message?.includes("Invalid login credentials")) {
    return createAppError(
      "Invalid email or password",
      ERROR_CODES.INVALID_CREDENTIALS,
      401,
      context,
    );
  }

  if (supabaseError.message?.includes("Email not confirmed")) {
    return createAppError(
      "Please confirm your email address",
      ERROR_CODES.UNAUTHORIZED,
      401,
      context,
    );
  }

  // Handle database constraint errors
  if (
    supabaseError.code === "23505" ||
    supabaseError.message?.includes("duplicate key")
  ) {
    return createAppError(
      "This value already exists",
      ERROR_CODES.UNIQUE_VIOLATION,
      409,
      context,
    );
  }

  if (
    supabaseError.code === "23503" ||
    supabaseError.message?.includes("foreign key")
  ) {
    return createAppError(
      "Cannot delete item that is referenced by other records",
      ERROR_CODES.FOREIGN_KEY_VIOLATION,
      409,
      context,
    );
  }

  if (
    supabaseError.code === "23514" ||
    supabaseError.message?.includes("check constraint")
  ) {
    return createAppError(
      "Data validation failed",
      ERROR_CODES.CONSTRAINT_VIOLATION,
      400,
      context,
    );
  }

  // Handle network errors
  if (
    supabaseError.message?.includes("fetch") ||
    supabaseError.message?.includes("network")
  ) {
    return createAppError(
      "Network error occurred",
      ERROR_CODES.NETWORK_ERROR,
      0,
      context,
    );
  }

  return createAppError(
    supabaseError.message || "Database operation failed",
    ERROR_CODES.OPERATION_FAILED,
    supabaseError.status || 500,
    context,
  );
};

/**
 * Generates a unique error ID for tracking
 */
export const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Sanitizes error for logging (removes sensitive data)
 */
export const sanitizeErrorForLogging = (error: AppError): Partial<AppError> => {
  const sanitized = { ...error };

  // Remove sensitive data from details
  if (sanitized.details) {
    const sensitiveKeys = ["password", "token", "secret", "key", "auth"];
    sensitiveKeys.forEach((key) => {
      if (sanitized.details && sanitized.details[key]) {
        sanitized.details[key] = "[REDACTED]";
      }
    });
  }

  return sanitized;
};
