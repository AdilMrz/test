import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Progress,
} from "../ui";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  department: string;
  notifications: boolean;
  newsletter: boolean;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const TailwindForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    department: "",
    notifications: true,
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const roleOptions = [
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "analyst", label: "Analyst" },
  ];

  const departmentOptions = [
    { value: "engineering", label: "Engineering", description: "Software development and technical roles" },
    { value: "design", label: "Design", description: "UI/UX and creative roles" },
    { value: "marketing", label: "Marketing", description: "Growth and marketing roles" },
    { value: "sales", label: "Sales", description: "Sales and business development" },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        department: "",
        notifications: true,
        newsletter: false,
        terms: false,
      });
    }, 3000);
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getFormProgress = (): number => {
    const requiredFields = ['firstName', 'lastName', 'email', 'role', 'department'];
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return typeof value === 'string' ? value.trim() : value;
    });
    return (filledFields.length / requiredFields.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">User Registration Form</CardTitle>
              <p className="text-gray-600 mt-2">Complete your profile information</p>
            </div>
            <Badge variant={getFormProgress() === 100 ? "success" : "secondary"}>
              {Math.round(getFormProgress())}% Complete
            </Badge>
          </div>
          <Progress 
            value={getFormProgress()} 
            className="mt-4"
            variant={getFormProgress() === 100 ? "success" : "default"}
          />
        </CardHeader>

        <CardContent>
          {submitSuccess && (
            <Alert variant="success" className="mb-6">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your registration has been submitted successfully. Welcome aboard!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <Select
                    options={roleOptions}
                    value={formData.role}
                    onValueChange={(value) => updateField('role', value)}
                    placeholder="Select your role"
                    className={errors.role ? "border-red-500" : ""}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Department *
                  </label>
                  <RadioGroup
                    options={departmentOptions}
                    value={formData.department}
                    onValueChange={(value) => updateField('department', value)}
                    name="department"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  <Switch
                    checked={formData.notifications}
                    onChange={(e) => updateField('notifications', e.target.checked)}
                    label="Email Notifications"
                    description="Receive important updates and notifications via email"
                  />

                  <Switch
                    checked={formData.newsletter}
                    onChange={(e) => updateField('newsletter', e.target.checked)}
                    label="Newsletter Subscription"
                    description="Get our weekly newsletter with tips and updates"
                  />

                  <Checkbox
                    checked={formData.terms}
                    onChange={(e) => updateField('terms', e.target.checked)}
                    label="I accept the terms and conditions *"
                    description="Please read and accept our terms of service and privacy policy"
                    className={errors.terms ? "border-red-500" : ""}
                  />
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
