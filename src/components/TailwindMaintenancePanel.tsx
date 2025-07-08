import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  Progress,
  Badge,
} from "./ui";
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  progress?: number;
  estimatedTime?: string;
  startTime?: string;
  endTime?: string;
}

interface MaintenancePanelProps {
  isMaintenanceMode: boolean;
  tasks: MaintenanceTask[];
  onRetry?: () => void;
  onRefresh?: () => void;
  estimatedCompletion?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

const getStatusIcon = (status: MaintenanceTask["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    case "failed":
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    case "in-progress":
      return <ArrowPathIcon className="w-5 h-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: MaintenanceTask["status"]) => {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "in-progress":
      return <Badge variant="warning">In Progress</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

export const TailwindMaintenancePanel: React.FC<MaintenancePanelProps> = ({
  isMaintenanceMode,
  tasks,
  onRetry,
  onRefresh,
  estimatedCompletion,
  contactInfo,
}) => {
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const totalTasks = tasks.length;
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (!isMaintenanceMode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-100 rounded-full">
                <WrenchScrewdriverIcon className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              System Maintenance in Progress
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              We're currently performing scheduled maintenance to improve your experience. 
              Please check back shortly.
            </p>

            {estimatedCompletion && (
              <Alert variant="info" className="mb-6">
                <ClockIcon className="w-4 h-4" />
                <AlertTitle>Estimated Completion</AlertTitle>
                <AlertDescription>
                  Maintenance is expected to complete by {estimatedCompletion}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-500">
                  {completedTasks} of {totalTasks} tasks completed
                </span>
              </div>
              <Progress 
                value={overallProgress} 
                variant={overallProgress === 100 ? "success" : "default"}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <WrenchScrewdriverIcon className="w-5 h-5" />
              <span>Maintenance Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {task.title}
                      </h3>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description}
                    </p>
                    
                    {task.status === "in-progress" && task.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} size="sm" />
                      </div>
                    )}
                    
                    <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                      {task.estimatedTime && (
                        <span>Est. time: {task.estimatedTime}</span>
                      )}
                      {task.startTime && (
                        <span>Started: {task.startTime}</span>
                      )}
                      {task.endTime && (
                        <span>Completed: {task.endTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600">
                  If you have urgent questions, please contact our support team.
                </p>
                
                {contactInfo && (
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    {contactInfo.email && (
                      <div>Email: <a href={`mailto:${contactInfo.email}`} className="text-project-green-800 hover:underline">{contactInfo.email}</a></div>
                    )}
                    {contactInfo.phone && (
                      <div>Phone: <a href={`tel:${contactInfo.phone}`} className="text-project-green-800 hover:underline">{contactInfo.phone}</a></div>
                    )}
                    {contactInfo.website && (
                      <div>Website: <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-project-green-800 hover:underline">{contactInfo.website}</a></div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                {onRefresh && (
                  <Button variant="outline" onClick={onRefresh}>
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                )}
                
                {onRetry && (
                  <Button variant="default" onClick={onRetry}>
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Thank you for your patience while we improve our services.</p>
          <p className="mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};
