import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    // You'll need to replace this with your actual Sentry DSN
    dsn: import.meta.env.VITE_SENTRY_DSN || "",

    // Set sample rates
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0,

    // Environment
    environment: import.meta.env.MODE || "development",

    // Integrations
    integrations: [Sentry.browserTracingIntegration()],

    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || "1.0.0",

    // Before send hook to filter out sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive information
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === "object" && "message" in error) {
          // Remove sensitive data from error messages
          const sensitivePatterns = [
            /password/i,
            /token/i,
            /key/i,
            /secret/i,
            /auth/i,
          ];

          let message = error.message as string;
          sensitivePatterns.forEach((pattern) => {
            message = message.replace(pattern, "[REDACTED]");
          });

          if (event.exception.values?.[0]) {
            event.exception.values[0].value = message;
          }
        }
      }

      return event;
    },
  });
};

// Helper function to capture exceptions with context
export const captureException = (
  error: Error,
  context?: {
    user?: { id?: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  },
) => {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
};

// Helper function to capture messages
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: {
    user?: { id?: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) => {
  Sentry.withScope((scope) => {
    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureMessage(message, level);
  });
};

// Helper to set user context
export const setUser = (user: {
  id?: string;
  email?: string;
  username?: string;
}) => {
  Sentry.setUser(user);
};

// Helper to add breadcrumb
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: Sentry.SeverityLevel;
  data?: Record<string, unknown>;
}) => {
  Sentry.addBreadcrumb(breadcrumb);
};
