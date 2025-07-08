import { useCallback, useRef } from "react";
import { useNotify } from "react-admin";
import type { AppError, ErrorContext } from "../types/errors";
import {
  normalizeError,
  getUserFriendlyMessage,
  getErrorSeverity,
  generateErrorId,
  sanitizeErrorForLogging,
} from "../utils/errorUtils";
import { captureException, addBreadcrumb } from "../utils/sentry";
import { supabaseClient } from "../supabase";

interface UseErrorHandlerOptions {
  enableLogging?: boolean;
  enableNotifications?: boolean;
  logToConsole?: boolean;
  logToSentry?: boolean;
}

interface ErrorHandlerResult {
  handleError: (error: unknown, context?: ErrorContext) => Promise<string>;
  handleErrorSync: (error: unknown, context?: ErrorContext) => string;
  logError: (error: AppError, context?: ErrorContext) => Promise<void>;
  clearError: () => void;
}

/**
 * Centralized error handling hook
 */
export const useErrorHandler = (
  options: UseErrorHandlerOptions = {},
): ErrorHandlerResult => {
  const notify = useNotify();
  const errorCache = useRef(new Map<string, AppError>());

  const {
    enableLogging = true,
    enableNotifications = true,
    logToConsole = true,
    logToSentry = true,
  } = options;

  /**
   * Logs error to various destinations
   */
  const logError = useCallback(
    async (error: AppError, context?: ErrorContext): Promise<void> => {
      if (!enableLogging) return;

      const errorId = generateErrorId();
      const severity = getErrorSeverity(error);
      const sanitizedError = sanitizeErrorForLogging(error);

      // Log to console
      if (logToConsole) {
        const logMethod =
          severity === "critical"
            ? "error"
            : severity === "high"
              ? "error"
              : severity === "medium"
                ? "warn"
                : "info";

        console[logMethod](`[${errorId}] ${error.message}`, {
          code: error.code,
          status: error.status,
          severity,
          context,
          stack: error.stack,
        });
      }

      // Log to Sentry
      if (logToSentry) {
        try {
          // Get current user for context
          const {
            data: { user },
          } = await supabaseClient.auth.getUser();

          // Add breadcrumb for context
          addBreadcrumb({
            message: `Error occurred in ${context?.resource || "unknown"} during ${context?.action || "unknown action"}`,
            category: "error",
            level:
              severity === "critical"
                ? "fatal"
                : severity === "high"
                  ? "error"
                  : severity === "medium"
                    ? "warning"
                    : "info",
            data: {
              resource: context?.resource,
              action: context?.action,
              url: window.location.href,
            },
          });

          // Capture exception with context
          captureException(error, {
            user: user ? { id: user.id, email: user.email } : undefined,
            tags: {
              severity,
              resource: context?.resource || "unknown",
              action: context?.action || "unknown",
              errorCode: error.code || "unknown",
            },
            extra: {
              context: context?.metadata,
              userAgent: navigator.userAgent,
              url: window.location.href,
              timestamp: new Date().toISOString(),
            },
            level:
              severity === "critical"
                ? "fatal"
                : severity === "high"
                  ? "error"
                  : severity === "medium"
                    ? "warning"
                    : "info",
          });
        } catch (sentryError) {
          // Fallback to console if Sentry logging fails
          console.error("Failed to log error to Sentry:", sentryError);
          console.error("Original error:", sanitizedError);
        }
      }

      // Cache error for potential retry or debugging
      errorCache.current.set(errorId, error);
    },
    [enableLogging, logToConsole, logToSentry],
  );

  /**
   * Shows user notification for error
   */
  const showNotification = useCallback(
    (error: AppError): void => {
      if (!enableNotifications) return;

      const message = getUserFriendlyMessage(error);
      const severity = getErrorSeverity(error);

      const notificationType = severity === "low" ? "warning" : "error";

      notify(message, {
        type: notificationType,
        autoHideDuration: severity === "critical" ? 10000 : 6000,
      });
    },
    [notify, enableNotifications],
  );

  /**
   * Main error handler (async)
   */
  const handleError = useCallback(
    async (error: unknown, context?: ErrorContext): Promise<string> => {
      const appError = normalizeError(error, context);
      const errorId = generateErrorId();

      // Log the error
      await logError(appError, context);

      // Show notification to user
      showNotification(appError);

      return errorId;
    },
    [logError, showNotification],
  );

  /**
   * Synchronous error handler (for cases where async is not possible)
   */
  const handleErrorSync = useCallback(
    (error: unknown, context?: ErrorContext): string => {
      const appError = normalizeError(error, context);
      const errorId = generateErrorId();

      // Log asynchronously without waiting
      logError(appError, context).catch(console.error);

      // Show notification to user
      showNotification(appError);

      return errorId;
    },
    [logError, showNotification],
  );

  /**
   * Clears error cache
   */
  const clearError = useCallback((): void => {
    errorCache.current.clear();
  }, []);

  return {
    handleError,
    handleErrorSync,
    logError,
    clearError,
  };
};
