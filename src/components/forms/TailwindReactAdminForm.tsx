import React from "react";
import {
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  required,
  useRecordContext,
  useInput,
  InputProps,
} from "react-admin";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Switch,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  Progress,
} from "../ui";

/**
 * Custom Tailwind Input that integrates with React Admin's form system
 */
interface TailwindTextInputProps extends InputProps {
  label?: string;
  helperText?: string;
  placeholder?: string;
}

export const TailwindTextInput: React.FC<TailwindTextInputProps> = ({
  source,
  label,
  helperText,
  placeholder,
  validate,
  ...props
}) => {
  const { field, fieldState } = useInput({ source, validate, ...props });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validate && validate.toString().includes('required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      <Input
        {...field}
        placeholder={placeholder}
        className={fieldState.error ? "border-red-500" : ""}
      />
      {fieldState.error && (
        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
      )}
      {helperText && !fieldState.error && (
        <p className="text-gray-500 text-sm">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Custom Tailwind Select that integrates with React Admin's form system
 */
interface TailwindSelectInputProps extends InputProps {
  label?: string;
  helperText?: string;
  placeholder?: string;
  choices: Array<{ id: any; name: string }>;
}

export const TailwindSelectInput: React.FC<TailwindSelectInputProps> = ({
  source,
  label,
  helperText,
  placeholder,
  choices,
  validate,
  ...props
}) => {
  const { field, fieldState } = useInput({ source, validate, ...props });

  const options = choices.map(choice => ({
    value: choice.id.toString(),
    label: choice.name,
  }));

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validate && validate.toString().includes('required') && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      <Select
        options={options}
        value={field.value?.toString() || ""}
        onValueChange={(value) => field.onChange(value)}
        placeholder={placeholder}
        className={fieldState.error ? "border-red-500" : ""}
      />
      {fieldState.error && (
        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
      )}
      {helperText && !fieldState.error && (
        <p className="text-gray-500 text-sm">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Custom Tailwind Switch that integrates with React Admin's form system
 */
interface TailwindSwitchInputProps extends InputProps {
  label?: string;
  description?: string;
}

export const TailwindSwitchInput: React.FC<TailwindSwitchInputProps> = ({
  source,
  label,
  description,
  ...props
}) => {
  const { field } = useInput({ source, ...props });

  return (
    <Switch
      checked={field.value || false}
      onChange={(e) => field.onChange(e.target.checked)}
      label={label}
      description={description}
    />
  );
};

/**
 * Enhanced form wrapper that provides better styling and progress tracking
 */
interface TailwindFormWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export const TailwindFormWrapper: React.FC<TailwindFormWrapperProps> = ({
  children,
  title,
  description,
  showProgress = false,
  currentStep = 1,
  totalSteps = 1,
}) => {
  const record = useRecordContext();
  const isEdit = !!record?.id;
  const progress = showProgress ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {title || (isEdit ? "Edit Record" : "Create New Record")}
              </CardTitle>
              {description && (
                <p className="text-gray-600 mt-2">{description}</p>
              )}
            </div>
            <Badge variant={isEdit ? "warning" : "success"}>
              {isEdit ? "Editing" : "Creating"}
            </Badge>
          </div>
          {showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Example of a complete hybrid form using both React Admin and Tailwind components
 */
export const HybridCustomerForm: React.FC = () => {
  return (
    <TailwindFormWrapper
      title="Customer Information"
      description="Manage customer details with our enhanced form interface"
    >
      <SimpleForm>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TailwindTextInput
            source="fullname"
            label="Full Name"
            placeholder="Enter customer's full name"
            validate={required()}
            helperText="This will be displayed on invoices and communications"
          />
          
          <TailwindTextInput
            source="email"
            label="Email Address"
            placeholder="customer@example.com"
            validate={required()}
            helperText="Primary contact email"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TailwindTextInput
            source="phone"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            helperText="Include country code if international"
          />
          
          <TailwindTextInput
            source="company"
            label="Company"
            placeholder="Company name (optional)"
          />
        </div>

        <div className="mt-6">
          <TailwindTextInput
            source="address"
            label="Address"
            placeholder="Street address, city, state, zip code"
            helperText="Full mailing address for shipping and billing"
          />
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
          
          <TailwindSwitchInput
            source="newsletter"
            label="Newsletter Subscription"
            description="Receive our monthly newsletter with updates and offers"
          />
          
          <TailwindSwitchInput
            source="notifications"
            label="Email Notifications"
            description="Get notified about order updates and important announcements"
          />
        </div>

        <Alert variant="info" className="mt-6">
          <AlertTitle>Data Privacy</AlertTitle>
          <AlertDescription>
            All customer information is encrypted and stored securely. We never share personal data with third parties without explicit consent.
          </AlertDescription>
        </Alert>
      </SimpleForm>
    </TailwindFormWrapper>
  );
};

/**
 * Example of a product form with enhanced styling
 */
export const HybridProductForm: React.FC = () => {
  const productCategories = [
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "books", name: "Books" },
    { id: "home", name: "Home & Garden" },
    { id: "sports", name: "Sports & Outdoors" },
  ];

  return (
    <TailwindFormWrapper
      title="Product Information"
      description="Add or edit product details with enhanced form controls"
    >
      <SimpleForm>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TailwindTextInput
            source="name"
            label="Product Name"
            placeholder="Enter product name"
            validate={required()}
            helperText="This will be displayed to customers"
          />
          
          <TailwindSelectInput
            source="category"
            label="Category"
            placeholder="Select a category"
            choices={productCategories}
            validate={required()}
            helperText="Choose the most appropriate category"
          />
        </div>

        <div className="mt-6">
          <TailwindTextInput
            source="description"
            label="Description"
            placeholder="Detailed product description"
            helperText="Provide a comprehensive description for customers"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <TailwindTextInput
            source="price"
            label="Price ($)"
            placeholder="0.00"
            validate={required()}
            helperText="Base price before taxes"
          />
          
          <TailwindTextInput
            source="stock"
            label="Stock Quantity"
            placeholder="0"
            helperText="Current inventory count"
          />
          
          <TailwindTextInput
            source="sku"
            label="SKU"
            placeholder="PROD-001"
            helperText="Unique product identifier"
          />
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Settings</h3>
          
          <TailwindSwitchInput
            source="active"
            label="Active Product"
            description="Make this product visible to customers"
          />
          
          <TailwindSwitchInput
            source="featured"
            label="Featured Product"
            description="Display this product prominently on the homepage"
          />
        </div>
      </SimpleForm>
    </TailwindFormWrapper>
  );
};
