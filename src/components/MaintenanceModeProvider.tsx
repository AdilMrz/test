import React, { createContext, useContext, useState, useEffect } from "react";
import { TailwindMaintenancePanel } from "./TailwindMaintenancePanel";

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

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (enabled: boolean) => void;
  tasks: MaintenanceTask[];
  setTasks: (tasks: MaintenanceTask[]) => void;
  updateTask: (taskId: string, updates: Partial<MaintenanceTask>) => void;
  estimatedCompletion?: string;
  setEstimatedCompletion: (time: string) => void;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  setContactInfo: (info: any) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(
  undefined,
);

export const useMaintenanceMode = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error(
      "useMaintenanceMode must be used within a MaintenanceModeProvider",
    );
  }
  return context;
};

interface MaintenanceModeProviderProps {
  children: React.ReactNode;
  defaultTasks?: MaintenanceTask[];
  defaultContactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export const MaintenanceModeProvider: React.FC<
  MaintenanceModeProviderProps
> = ({ children, defaultTasks = [], defaultContactInfo = {} }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(defaultTasks);
  const [estimatedCompletion, setEstimatedCompletion] = useState<string>();
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  // Check for maintenance mode from localStorage or environment
  useEffect(() => {
    const savedMaintenanceMode = localStorage.getItem("maintenanceMode");
    if (savedMaintenanceMode === "true") {
      setIsMaintenanceMode(true);
    }

    // Check environment variable for maintenance mode (safely)
    try {
      if (import.meta.env?.VITE_MAINTENANCE_MODE === "true") {
        setIsMaintenanceMode(true);
      }
    } catch (error) {
      // Fallback for environments where import.meta.env is not available
      console.log("Environment variables not available");
    }
  }, []);

  // Save maintenance mode to localStorage
  useEffect(() => {
    localStorage.setItem("maintenanceMode", isMaintenanceMode.toString());
  }, [isMaintenanceMode]);

  const setMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled);
  };

  const updateTask = (taskId: string, updates: Partial<MaintenanceTask>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  };

  const contextValue: MaintenanceContextType = {
    isMaintenanceMode,
    setMaintenanceMode,
    tasks,
    setTasks,
    updateTask,
    estimatedCompletion,
    setEstimatedCompletion,
    contactInfo,
    setContactInfo,
  };

  // If maintenance mode is enabled, show the maintenance panel instead of the app
  if (isMaintenanceMode) {
    return (
      <MaintenanceContext.Provider value={contextValue}>
        <TailwindMaintenancePanel
          isMaintenanceMode={true}
          tasks={tasks}
          estimatedCompletion={estimatedCompletion}
          contactInfo={contactInfo}
          onRefresh={() => window.location.reload()}
          onRetry={() => {
            // You can implement custom retry logic here
            console.log("Retry clicked during maintenance");
          }}
        />
      </MaintenanceContext.Provider>
    );
  }

  return (
    <MaintenanceContext.Provider value={contextValue}>
      {children}
    </MaintenanceContext.Provider>
  );
};

/**
 * Hook for managing maintenance mode programmatically
 */
export const useMaintenanceControls = () => {
  const {
    setMaintenanceMode,
    setTasks,
    updateTask,
    setEstimatedCompletion,
    setContactInfo,
  } = useMaintenanceMode();

  const startMaintenance = (
    tasks: MaintenanceTask[],
    estimatedCompletion?: string,
    contactInfo?: any,
  ) => {
    setTasks(tasks);
    if (estimatedCompletion) setEstimatedCompletion(estimatedCompletion);
    if (contactInfo) setContactInfo(contactInfo);
    setMaintenanceMode(true);
  };

  const endMaintenance = () => {
    setMaintenanceMode(false);
    setTasks([]);
    setEstimatedCompletion(undefined);
  };

  const simulateMaintenanceProgress = () => {
    // Example: Simulate a maintenance workflow
    const maintenanceTasks: MaintenanceTask[] = [
      {
        id: "1",
        title: "Database Backup",
        description: "Creating backup of all data before maintenance",
        status: "completed",
        estimatedTime: "15 minutes",
        startTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString(),
        endTime: new Date().toLocaleTimeString(),
      },
      {
        id: "2",
        title: "System Updates",
        description: "Installing security patches and system updates",
        status: "in-progress",
        progress: 60,
        estimatedTime: "30 minutes",
        startTime: new Date().toLocaleTimeString(),
      },
      {
        id: "3",
        title: "Service Restart",
        description: "Restarting services with new configurations",
        status: "pending",
        estimatedTime: "10 minutes",
      },
    ];

    startMaintenance(
      maintenanceTasks,
      new Date(Date.now() + 45 * 60 * 1000).toLocaleTimeString(), // 45 minutes from now
      {
        email: "support@example.com",
        phone: "+1 (555) 123-4567",
        website: "https://status.example.com",
      },
    );

    // Simulate progress updates
    setTimeout(() => {
      updateTask("2", { progress: 80 });
    }, 5000);

    setTimeout(() => {
      updateTask("2", {
        status: "completed",
        endTime: new Date().toLocaleTimeString(),
      });
      updateTask("3", {
        status: "in-progress",
        startTime: new Date().toLocaleTimeString(),
        progress: 30,
      });
    }, 10000);

    setTimeout(() => {
      updateTask("3", {
        status: "completed",
        endTime: new Date().toLocaleTimeString(),
      });
      // Auto-end maintenance after all tasks complete
      setTimeout(() => {
        endMaintenance();
      }, 2000);
    }, 15000);
  };

  return {
    startMaintenance,
    endMaintenance,
    simulateMaintenanceProgress,
    updateTask,
  };
};

/**
 * Component for testing maintenance mode controls
 */
export const MaintenanceControls: React.FC = () => {
  const { isMaintenanceMode } = useMaintenanceMode();
  const { startMaintenance, endMaintenance, simulateMaintenanceProgress } =
    useMaintenanceControls();

  if (isMaintenanceMode) {
    return null; // Don't show controls during maintenance
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 space-y-2">
      <h4 className="font-semibold text-sm text-gray-900">
        Maintenance Controls
      </h4>
      <div className="space-y-2">
        <button
          onClick={simulateMaintenanceProgress}
          className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
        >
          Start Maintenance Demo
        </button>
        <button
          onClick={endMaintenance}
          className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          End Maintenance
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Demo controls for testing maintenance mode
      </p>
    </div>
  );
};
