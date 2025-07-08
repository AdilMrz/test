import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "./ui";
import {
  NotificationProvider,
  useNotificationHelpers,
  useNotifications,
} from "./TailwindNotificationSystem";

const NotificationDemoContent: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationHelpers();
  const { clearAll, notifications } = useNotifications();

  const handleSuccess = () => {
    showSuccess(
      "Success!",
      "Your changes have been saved successfully.",
      { duration: 4000 }
    );
  };

  const handleError = () => {
    showError(
      "Error occurred",
      "Failed to save changes. Please try again.",
      {
        action: {
          label: "Retry",
          onClick: () => console.log("Retry action clicked"),
        },
      }
    );
  };

  const handleWarning = () => {
    showWarning(
      "Warning",
      "Your session will expire in 5 minutes. Please save your work.",
      { duration: 8000 }
    );
  };

  const handleInfo = () => {
    showInfo(
      "New Feature Available",
      "Check out our new dashboard analytics feature!",
      {
        action: {
          label: "Learn More",
          onClick: () => console.log("Learn more clicked"),
        },
        duration: 6000,
      }
    );
  };

  const handleMultiple = () => {
    showInfo("Processing", "Starting batch operation...");
    
    setTimeout(() => {
      showSuccess("Step 1", "Data validation completed");
    }, 1000);
    
    setTimeout(() => {
      showWarning("Step 2", "Some records need attention");
    }, 2000);
    
    setTimeout(() => {
      showSuccess("Complete", "All operations finished successfully!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Notification System Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test our Tailwind-based notification system with different types and actions
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Button
                variant="default"
                onClick={handleSuccess}
                className="bg-green-600 hover:bg-green-700"
              >
                Show Success
              </Button>
              
              <Button
                variant="default"
                onClick={handleError}
                className="bg-red-600 hover:bg-red-700"
              >
                Show Error
              </Button>
              
              <Button
                variant="default"
                onClick={handleWarning}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Show Warning
              </Button>
              
              <Button
                variant="default"
                onClick={handleInfo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Show Info
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={handleMultiple}
              >
                Show Multiple Notifications
              </Button>
              
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                Clear All ({notifications.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>4 notification types: Success, Error, Warning, Info</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Auto-dismiss with configurable duration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Manual dismiss with close button</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Action buttons for interactive notifications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Smooth slide-in/out animations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Maximum notification limit (5 by default)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Timestamp display</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-project-green-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Responsive design for mobile and desktop</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`// Wrap your app with NotificationProvider
<NotificationProvider>
  <App />
</NotificationProvider>

// Use in any component
const { showSuccess, showError } = useNotificationHelpers();

// Show notifications
showSuccess("Saved!", "Changes saved successfully");

showError("Error", "Failed to save", {
  action: {
    label: "Retry",
    onClick: () => handleRetry()
  }
});`}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>Active notifications: <span className="font-semibold">{notifications.length}</span></p>
              <p className="mt-2">
                Notifications appear in the top-right corner of the screen and will auto-dismiss 
                after their specified duration (except errors which persist until manually dismissed).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const TailwindNotificationDemo: React.FC = () => {
  return (
    <NotificationProvider maxNotifications={5} defaultDuration={5000}>
      <NotificationDemoContent />
    </NotificationProvider>
  );
};
