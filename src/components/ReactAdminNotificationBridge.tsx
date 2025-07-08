import { useEffect } from "react";
import { useNotify } from "react-admin";
import { useNotificationHelpers } from "./TailwindNotificationSystem";

/**
 * Bridge component that intercepts React Admin notifications
 * and displays them using our Tailwind notification system
 */
export const ReactAdminNotificationBridge = () => {
  const { showSuccess, showError, showWarning, showInfo } =
    useNotificationHelpers();

  useEffect(() => {
    // Listen for React Admin notification events
    const handleNotification = (event: CustomEvent) => {
      const {
        message,
        type = "info",
        messageArgs = {},
        undoable = false,
      } = event.detail;

      // Format the message if it has interpolation
      let formattedMessage = message;
      if (messageArgs && Object.keys(messageArgs).length > 0) {
        formattedMessage = message.replace(/%\{(\w+)\}/g, (match, key) => {
          return messageArgs[key] || match;
        });
      }

      // Map React Admin notification types to our Tailwind types
      switch (type) {
        case "success":
          showSuccess("Success", formattedMessage, {
            duration: undoable ? 0 : 4000,
            action: undoable
              ? {
                  label: "Undo",
                  onClick: () => {
                    console.log("Undo action triggered");
                  },
                }
              : undefined,
          });
          break;
        case "error":
          showError("Error", formattedMessage);
          break;
        case "warning":
          showWarning("Warning", formattedMessage);
          break;
        case "info":
        default:
          showInfo("Information", formattedMessage);
          break;
      }
    };

    // Add event listener for custom notification events
    window.addEventListener("ra-notification" as any, handleNotification);

    return () => {
      window.removeEventListener("ra-notification" as any, handleNotification);
    };
  }, [showSuccess, showError, showWarning, showInfo]);

  // Also create a direct notification interceptor
  useEffect(() => {
    // Create a custom notify function that uses our Tailwind system
    const customNotify = (message: string, options: any = {}) => {
      const { type = "info", messageArgs = {}, undoable = false } = options;

      // Format the message if it has interpolation
      let formattedMessage = message;
      if (messageArgs && Object.keys(messageArgs).length > 0) {
        formattedMessage = message.replace(/%\{(\w+)\}/g, (match, key) => {
          return messageArgs[key] || match;
        });
      }

      // Map React Admin notification types to our Tailwind types
      switch (type) {
        case "success":
          showSuccess("Success", formattedMessage, {
            duration: undoable ? 0 : 4000,
            action: undoable
              ? {
                  label: "Undo",
                  onClick: () => {
                    // Handle undo action if needed
                    console.log("Undo action triggered");
                  },
                }
              : undefined,
          });
          break;
        case "error":
          showError("Error", formattedMessage, {
            duration: 0, // Errors persist until manually dismissed
          });
          break;
        case "warning":
          showWarning("Warning", formattedMessage, {
            duration: 6000,
          });
          break;
        case "info":
        default:
          showInfo("Information", formattedMessage, {
            duration: 5000,
          });
          break;
      }
    };

    // Store the custom notify function globally so React Admin can use it
    (window as any).__customNotify = customNotify;

    // Also intercept the default notify function
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      // Check if this is a React Admin notification
      if (
        args[0] &&
        typeof args[0] === "string" &&
        args[0].includes("ra.notification")
      ) {
        // This is a React Admin notification, use our custom system
        customNotify(args[0], { type: "info" });
      } else {
        originalConsoleLog(...args);
      }
    };

    return () => {
      // Cleanup
      delete (window as any).__customNotify;
      console.log = originalConsoleLog;
    };
  }, [showSuccess, showError, showWarning, showInfo]);

  return null; // This component doesn't render anything
};

/**
 * Custom hook that provides a notify function compatible with React Admin
 * but uses our Tailwind notification system
 */
export const useTailwindNotify = () => {
  const { showSuccess, showError, showWarning, showInfo } =
    useNotificationHelpers();

  const notify = (message: string, options: any = {}) => {
    const { type = "info", messageArgs = {}, undoable = false } = options;

    // Format the message if it has interpolation
    let formattedMessage = message;
    if (messageArgs && Object.keys(messageArgs).length > 0) {
      formattedMessage = message.replace(/%\{(\w+)\}/g, (match, key) => {
        return messageArgs[key] || match;
      });
    }

    // Map React Admin notification types to our Tailwind types
    switch (type) {
      case "success":
        showSuccess("Success", formattedMessage, {
          duration: undoable ? 0 : 4000,
          action: undoable
            ? {
                label: "Undo",
                onClick: () => {
                  console.log("Undo action triggered");
                },
              }
            : undefined,
        });
        break;
      case "error":
        showError("Error", formattedMessage);
        break;
      case "warning":
        showWarning("Warning", formattedMessage);
        break;
      case "info":
      default:
        showInfo("Information", formattedMessage);
        break;
    }
  };

  return notify;
};

/**
 * Enhanced notification helpers with React Admin compatibility
 */
export const useEnhancedNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } =
    useNotificationHelpers();
  const tailwindNotify = useTailwindNotify();

  return {
    // Original Tailwind notification helpers
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // React Admin compatible notify
    notify: tailwindNotify,

    // Convenience methods for common React Admin scenarios
    notifySuccess: (message: string, undoable = false) =>
      tailwindNotify(message, { type: "success", undoable }),

    notifyError: (message: string) =>
      tailwindNotify(message, { type: "error" }),

    notifyWarning: (message: string) =>
      tailwindNotify(message, { type: "warning" }),

    notifyInfo: (message: string) => tailwindNotify(message, { type: "info" }),

    // CRUD operation notifications
    notifyCreated: (resourceName: string, id?: any) =>
      showSuccess(
        "Created",
        `${resourceName} created successfully${id ? ` (ID: ${id})` : ""}`,
        { duration: 4000 },
      ),

    notifyUpdated: (resourceName: string, id?: any) =>
      showSuccess(
        "Updated",
        `${resourceName} updated successfully${id ? ` (ID: ${id})` : ""}`,
        { duration: 4000 },
      ),

    notifyDeleted: (resourceName: string, id?: any) =>
      showSuccess(
        "Deleted",
        `${resourceName} deleted successfully${id ? ` (ID: ${id})` : ""}`,
        { duration: 4000 },
      ),

    notifyValidationError: (message = "Please check the form for errors") =>
      showError("Validation Error", message),

    notifyNetworkError: (
      message = "Network error. Please check your connection.",
    ) => showError("Network Error", message),

    notifyPermissionError: (
      message = "You do not have permission to perform this action",
    ) => showWarning("Permission Denied", message),
  };
};
