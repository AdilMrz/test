import React, { createContext, useContext, ReactNode } from 'react';
import { NotificationContextValue } from 'react-admin';
import { useNotificationHelpers } from './TailwindNotificationSystem';

// Create a custom notification context that overrides React Admin's default
const CustomNotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface CustomNotificationProviderProps {
  children: ReactNode;
}

export const CustomNotificationProvider: React.FC<CustomNotificationProviderProps> = ({ children }) => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationHelpers();

  const notify = (message: string, options: any = {}) => {
    const { type = 'info', messageArgs = {}, undoable = false } = options;
    
    // Format the message if it has interpolation
    let formattedMessage = message;
    if (messageArgs && Object.keys(messageArgs).length > 0) {
      formattedMessage = message.replace(/%\{(\w+)\}/g, (match, key) => {
        return messageArgs[key] || match;
      });
    }

    // Map React Admin notification types to our Tailwind types
    switch (type) {
      case 'success':
        showSuccess('Success', formattedMessage, {
          duration: undoable ? 0 : 4000,
          action: undoable ? {
            label: 'Undo',
            onClick: () => {
              console.log('Undo action triggered');
            }
          } : undefined
        });
        break;
      case 'error':
        showError('Error', formattedMessage);
        break;
      case 'warning':
        showWarning('Warning', formattedMessage);
        break;
      case 'info':
      default:
        showInfo('Information', formattedMessage);
        break;
    }
  };

  const contextValue: NotificationContextValue = {
    notifications: [], // We don't track notifications in the old way
    addNotification: (notification) => {
      notify(notification.message, {
        type: notification.type,
        messageArgs: notification.messageArgs,
        undoable: notification.undoable
      });
    },
    takeNotification: () => undefined, // Not used with our system
    resetNotifications: () => {}, // Not used with our system
  };

  return (
    <CustomNotificationContext.Provider value={contextValue}>
      {children}
    </CustomNotificationContext.Provider>
  );
};

// Hook to use the custom notification context
export const useCustomNotification = () => {
  const context = useContext(CustomNotificationContext);
  if (!context) {
    throw new Error('useCustomNotification must be used within a CustomNotificationProvider');
  }
  return context;
};
