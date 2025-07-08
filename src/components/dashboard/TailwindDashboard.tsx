import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Button } from "../ui";
import { 
  UsersIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: React.ComponentType<{ className?: string }>;
  color?: "green" | "blue" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "green" 
}) => {
  const colorClasses = {
    green: "text-project-green-800 bg-project-green-100",
    blue: "text-blue-800 bg-blue-100",
    purple: "text-purple-800 bg-purple-100",
    orange: "text-orange-800 bg-orange-100",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {change.type === "increase" ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  change.type === "increase" ? "text-green-600" : "text-red-600"
                }`}>
                  {Math.abs(change.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityItem {
  id: string;
  type: "user" | "order" | "product";
  message: string;
  time: string;
}

const RecentActivity: React.FC = () => {
  const activities: RecentActivityItem[] = [
    { id: "1", type: "user", message: "New user registered: john@example.com", time: "2 minutes ago" },
    { id: "2", type: "order", message: "Order #1234 completed successfully", time: "5 minutes ago" },
    { id: "3", type: "product", message: "Product 'Laptop Pro' updated", time: "10 minutes ago" },
    { id: "4", type: "user", message: "User profile updated: jane@example.com", time: "15 minutes ago" },
    { id: "5", type: "order", message: "New order received: #1235", time: "20 minutes ago" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <UsersIcon className="w-4 h-4 text-blue-600" />;
      case "order":
        return <ShoppingCartIcon className="w-4 h-4 text-green-600" />;
      case "product":
        return <CurrencyDollarIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full">
            <EyeIcon className="w-4 h-4 mr-2" />
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActions: React.FC = () => {
  const actions = [
    { label: "Add Customer", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Create Product", color: "bg-green-600 hover:bg-green-700" },
    { label: "New Order", color: "bg-purple-600 hover:bg-purple-700" },
    { label: "View Reports", color: "bg-orange-600 hover:bg-orange-700" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              className={`${action.color} text-white border-0 h-12`}
              variant="default"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const TailwindDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,543"
          change={{ value: 12, type: "increase" }}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          change={{ value: 8, type: "increase" }}
          icon={ShoppingCartIcon}
          color="green"
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          change={{ value: 23, type: "increase" }}
          icon={CurrencyDollarIcon}
          color="purple"
        />
        <StatCard
          title="Growth Rate"
          value="15.3%"
          change={{ value: 3, type: "decrease" }}
          icon={TrendingUpIcon}
          color="orange"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
