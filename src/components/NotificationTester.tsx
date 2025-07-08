import React from "react";
import { useNotify } from "react-admin";
import { useEnhancedNotifications } from "./ReactAdminNotificationBridge";
import { Button } from "./ui";

export const NotificationTester: React.FC = () => {
  const notify = useNotify();
  const { showSuccess, showError, showWarning, showInfo } = useEnhancedNotifications();

  const testReactAdminNotifications = () => {
    notify("React Admin Success", { type: "success" });
    setTimeout(() => {
      notify("React Admin Error", { type: "error" });
    }, 1000);
    setTimeout(() => {
      notify("React Admin Warning", { type: "warning" });
    }, 2000);
    setTimeout(() => {
      notify("React Admin Info", { type: "info" });
    }, 3000);
  };

  const testTailwindNotifications = () => {
    showSuccess("Tailwind Success", "This is a success message");
    setTimeout(() => {
      showError("Tailwind Error", "This is an error message");
    }, 1000);
    setTimeout(() => {
      showWarning("Tailwind Warning", "This is a warning message");
    }, 2000);
    setTimeout(() => {
      showInfo("Tailwind Info", "This is an info message");
    }, 3000);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 space-y-2">
      <h4 className="font-semibold text-sm text-gray-900">Notification Tester</h4>
      <div className="space-y-2">
        <Button
          onClick={testReactAdminNotifications}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Test React Admin Notifications
        </Button>
        <Button
          onClick={testTailwindNotifications}
          variant="default"
          size="sm"
          className="w-full"
        >
          Test Tailwind Notifications
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Test notification systems
      </p>
    </div>
  );
};
