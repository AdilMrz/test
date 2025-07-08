import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900 [&>svg]:text-gray-600",
        success: "bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-600",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600",
        error: "bg-red-50 border-red-200 text-red-800 [&>svg]:text-red-600",
        info: "bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const getIcon = (variant: string) => {
  switch (variant) {
    case "success":
      return CheckCircleIcon;
    case "warning":
      return ExclamationTriangleIcon;
    case "error":
      return XCircleIcon;
    case "info":
      return InformationCircleIcon;
    default:
      return InformationCircleIcon;
  }
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", dismissible = false, onDismiss, children, ...props }, ref) => {
    const IconComponent = getIcon(variant || "default");

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <IconComponent className="h-4 w-4" />
        <div className="flex-1">
          {children}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <XMarkIcon className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
