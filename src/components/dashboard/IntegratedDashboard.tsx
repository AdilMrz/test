import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Progress,
} from "../ui";
import { useGetList, useGetOne, useDataProvider } from "react-admin";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEnhancedNotifications } from "../ReactAdminNotificationBridge";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: React.ComponentType<{ className?: string }>;
  color?: "green" | "blue" | "purple" | "orange";
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = "green",
  isLoading = false,
}) => {
  const colorClasses = {
    green: "text-project-green-800 bg-project-green-100",
    blue: "text-blue-800 bg-blue-100",
    purple: "text-purple-800 bg-purple-100",
    orange: "text-orange-800 bg-orange-100",
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <span
                  className={`text-sm font-medium ${
                    change.type === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.abs(change.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs last month
                </span>
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

const QuickActions: React.FC = () => {
  const { notifySuccess } = useEnhancedNotifications();
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Customer",
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        notifySuccess("Navigating to customer creation");
        navigate("/customers/create");
      },
    },
    {
      label: "Create Product",
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => {
        notifySuccess("Navigating to product creation");
        navigate("/products/create");
      },
    },
    {
      label: "New Purchase",
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => {
        notifySuccess("Navigating to purchase creation");
        navigate("/purchases/create");
      },
    },
    {
      label: "View Reports",
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => {
        notifySuccess("Feature coming soon!");
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              className={`${action.color} text-white border-0 h-12`}
              variant="default"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivity: React.FC = () => {
  // Get recent data from React Admin
  const { data: customers, isLoading: customersLoading } = useGetList(
    "customers",
    {
      pagination: { page: 1, perPage: 3 },
      sort: { field: "id", order: "DESC" },
    },
  );

  const { data: purchases, isLoading: purchasesLoading } = useGetList(
    "purchases",
    {
      pagination: { page: 1, perPage: 3 },
      sort: { field: "id", order: "DESC" },
    },
  );

  const activities = [
    ...(customers || []).map((customer) => ({
      id: `customer-${customer.id}`,
      type: "user" as const,
      message: `New customer registered: ${customer.fullname || customer.name || "Unknown"}`,
      time: "Recently",
    })),
    ...(purchases || []).map((purchase) => ({
      id: `purchase-${purchase.id}`,
      type: "order" as const,
      message: `New purchase: $${purchase.total || "0.00"}`,
      time: "Recently",
    })),
  ].slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <UsersIcon className="w-4 h-4 text-blue-600" />;
      case "order":
        return <ShoppingCartIcon className="w-4 h-4 text-green-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  if (customersLoading || purchasesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
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

export const IntegratedDashboard: React.FC = () => {
  // Get data from React Admin resources
  const { data: customers, isLoading: customersLoading } = useGetList(
    "customers",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    },
  );

  const { data: purchases, isLoading: purchasesLoading } = useGetList(
    "purchases",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    },
  );

  const { data: products, isLoading: productsLoading } = useGetList(
    "products",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    },
  );

  // Calculate stats from real data
  const totalCustomers = customers?.length || 0;
  const totalPurchases = purchases?.length || 0;
  const totalProducts = products?.length || 0;
  const totalRevenue =
    purchases?.reduce((sum, purchase) => sum + (purchase.total || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          change={{ value: 12, type: "increase" }}
          icon={UsersIcon}
          color="blue"
          isLoading={customersLoading}
        />
        <StatCard
          title="Total Purchases"
          value={totalPurchases}
          change={{ value: 8, type: "increase" }}
          icon={ShoppingCartIcon}
          color="green"
          isLoading={purchasesLoading}
        />
        <StatCard
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={{ value: 23, type: "increase" }}
          icon={CurrencyDollarIcon}
          color="purple"
          isLoading={purchasesLoading}
        />
        <StatCard
          title="Products"
          value={totalProducts}
          change={{ value: 3, type: "increase" }}
          icon={ChartBarIcon}
          color="orange"
          isLoading={productsLoading}
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
