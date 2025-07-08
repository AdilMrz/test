import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  Alert,
  AlertTitle,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  Badge,
  Progress,
  Switch,
} from "./ui";

export const TailwindShowcase: React.FC = () => {
  const [selectValue, setSelectValue] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3", disabled: true },
    { value: "option4", label: "Option 4" },
  ];

  const radioOptions = [
    { value: "small", label: "Small", description: "Perfect for personal use" },
    { value: "medium", label: "Medium", description: "Great for small teams" },
    { value: "large", label: "Large", description: "Best for organizations" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tailwind Component Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Explore our custom Tailwind CSS component library
          </p>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="success">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review your settings before proceeding.
              </AlertDescription>
            </Alert>

            <Alert
              variant="error"
              dismissible
              onDismiss={() => console.log("Dismissed")}
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>

            <Alert variant="info">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                New features are available in this update.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* New Components - Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>🆕 Tabs Component</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="tab1"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="tab1">Overview</TabsTrigger>
                <TabsTrigger value="tab2">Analytics</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p className="text-gray-600">
                  Overview content goes here. This is the main dashboard view.
                </p>
              </TabsContent>
              <TabsContent value="tab2">
                <p className="text-gray-600">
                  Analytics content with charts and metrics would be displayed
                  here.
                </p>
              </TabsContent>
              <TabsContent value="tab3">
                <p className="text-gray-600">
                  Settings and configuration options would be available in this
                  tab.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* New Components - Badges and Progress */}
        <Card>
          <CardHeader>
            <CardTitle>🆕 Badges & Progress Bars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Progress Bars
              </h4>
              <div className="space-y-4">
                <Progress value={75} showLabel label="Project Progress" />
                <Progress
                  value={45}
                  variant="warning"
                  showLabel
                  label="Storage Used"
                />
                <Progress
                  value={90}
                  variant="success"
                  showLabel
                  label="Profile Complete"
                />
                <Progress
                  value={25}
                  variant="error"
                  showLabel
                  label="Issues Resolved"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Components - Switch and Tooltip */}
        <Card>
          <CardHeader>
            <CardTitle>🆕 Switch & Tooltip Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Switch Components
              </h4>
              <div className="space-y-4">
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                  label="Enable notifications"
                  description="Receive email notifications for important updates"
                />
                <Switch label="Dark mode" description="Switch to dark theme" />
                <Switch
                  label="Auto-save"
                  description="Automatically save your work"
                  size="sm"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Tooltips
              </h4>
              <div className="flex space-x-4">
                <Tooltip content="This is a helpful tooltip">
                  <Button variant="outline">Hover me</Button>
                </Tooltip>
                <Tooltip content="Settings and preferences" side="bottom">
                  <Button variant="ghost">Bottom tooltip</Button>
                </Tooltip>
                <Tooltip content="User profile information" side="left">
                  <Button variant="secondary">Left tooltip</Button>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input
              </label>
              <Input placeholder="Enter your name..." />
            </div>

            {/* Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Dropdown
              </label>
              <Select
                options={selectOptions}
                value={selectValue}
                onValueChange={setSelectValue}
                placeholder="Choose an option..."
              />
            </div>

            {/* Checkbox */}
            <div>
              <Checkbox
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
                label="Accept terms and conditions"
                description="By checking this box, you agree to our terms of service."
              />
            </div>

            {/* Radio Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a plan
              </label>
              <RadioGroup
                options={radioOptions}
                value={radioValue}
                onValueChange={setRadioValue}
                name="plan"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to proceed? This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-project-green-800">
                1,234
              </div>
              <p className="text-gray-600">Total Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-project-green-800">
                $45,678
              </div>
              <p className="text-gray-600">This Month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-project-green-800">
                +23%
              </div>
              <p className="text-gray-600">vs Last Month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
