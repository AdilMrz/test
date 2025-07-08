import React, { useState, useEffect, createContext, useContext } from "react";
import { Alert, AlertTitle, AlertDescription, Button } from "./ui";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? defaultDuration,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(onRemove, 300); // Wait for animation
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertVariant = () => {
    switch (notification.type) {
      case "success":
        return "success" as const;
      case "error":
        return "error" as const;
      case "warning":
        return "warning" as const;
      case "info":
        return "info" as const;
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible && !isRemoving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <Alert variant={getAlertVariant()} className="relative pr-12 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-sm font-semibold">
              {notification.title}
            </AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {notification.message}
            </AlertDescription>
            
            {notification.action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={notification.action.onClick}
                  className="text-xs"
                >
                  {notification.action.label}
                </Button>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/5 transition-colors duration-200"
        >
          <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
      </Alert>
    </div>
  );
};

// Convenience hooks for different notification types
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    showSuccess: (title: string, message: string, options?: Partial<Notification>) =>
      addNotification({ type: "success", title, message, ...options }),
    
    showError: (title: string, message: string, options?: Partial<Notification>) =>
      addNotification({ type: "error", title, message, duration: 0, ...options }),
    
    showWarning: (title: string, message: string, options?: Partial<Notification>) =>
      addNotification({ type: "warning", title, message, ...options }),
    
    showInfo: (title: string, message: string, options?: Partial<Notification>) =>
      addNotification({ type: "info", title, message, ...options }),
  };
};
