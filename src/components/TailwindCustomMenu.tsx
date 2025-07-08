import React from "react";
import { Menu, MenuItemLink, useResourceDefinitions } from "react-admin";
import { Badge } from "./ui";
import {
  Squares2X2Icon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  BellIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const TailwindCustomMenu = () => {
  const resources = useResourceDefinitions();

  return (
    <Menu>
      {/* Default React Admin Resources */}
      {Object.keys(resources).map((name) => (
        <Menu.ResourceItem key={name} name={name} />
      ))}
      
      {/* Separator */}
      <div className="px-4 py-2">
        <div className="border-t border-gray-200"></div>
      </div>
      
      {/* Tailwind Components Section */}
      <div className="px-4 py-2">
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-project-green-800" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tailwind Components
          </span>
          <Badge variant="success" className="text-xs">
            New
          </Badge>
        </div>
      </div>

      {/* Component Library */}
      <MenuItemLink
        to="/tailwind-showcase"
        primaryText="Component Library"
        leftIcon={<Squares2X2Icon className="w-5 h-5" />}
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: "40px",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      />

      {/* Dashboard Widgets */}
      <MenuItemLink
        to="/tailwind-dashboard"
        primaryText="Dashboard Widgets"
        leftIcon={<PresentationChartBarIcon className="w-5 h-5" />}
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: "40px",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      />

      {/* Advanced Forms */}
      <MenuItemLink
        to="/tailwind-form"
        primaryText="Advanced Forms"
        leftIcon={<DocumentTextIcon className="w-5 h-5" />}
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: "40px",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      />

      {/* Notification System */}
      <MenuItemLink
        to="/tailwind-notifications"
        primaryText="Notification System"
        leftIcon={<BellIcon className="w-5 h-5" />}
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: "40px",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      />

      {/* Maintenance Panel */}
      <MenuItemLink
        to="/tailwind-maintenance"
        primaryText="Maintenance Panel"
        leftIcon={<WrenchScrewdriverIcon className="w-5 h-5" />}
        sx={{
          "& .MuiListItemIcon-root": {
            minWidth: "40px",
          },
          "& .MuiListItemText-primary": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          "&:hover": {
            backgroundColor: "rgba(20, 83, 45, 0.04)",
          },
        }}
      />

      {/* Separator */}
      <div className="px-4 py-2 mt-2">
        <div className="border-t border-gray-200"></div>
      </div>
      
      {/* Info Section */}
      <div className="px-4 py-3">
        <div className="bg-project-green-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <SparklesIcon className="w-4 h-4 text-project-green-800 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-project-green-800 mb-1">
                Tailwind Integration
              </p>
              <p className="text-xs text-project-green-700 leading-relaxed">
                Explore modern UI components built with Tailwind CSS, integrated seamlessly with React Admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
};
