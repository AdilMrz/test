export interface AppError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
  timestamp?: Date;
  userId?: string;
  resource?: string;
  action?: string;
}

export interface ErrorContext {
  userId?: string;
  resource?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export type ErrorHandler = (error: AppError, context?: ErrorContext) => void;

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorId?: string;
}

// Common error codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  CONNECTION_LOST: "CONNECTION_LOST",

  // Authentication errors
  UNAUTHORIZED: "UNAUTHORIZED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

  // Permission errors
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  REQUIRED_FIELD: "REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",

  // Database errors
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION",
  FOREIGN_KEY_VIOLATION: "FOREIGN_KEY_VIOLATION",
  UNIQUE_VIOLATION: "UNIQUE_VIOLATION",

  // Business logic errors
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  OPERATION_FAILED: "OPERATION_FAILED",
  INVALID_STATE: "INVALID_STATE",

  // System errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
