import React from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: "sm" | "default" | "lg";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = "default", id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: {
        track: "h-5 w-9",
        thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
      },
      default: {
        track: "h-6 w-11",
        thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
      lg: {
        track: "h-7 w-12",
        thumb: "h-6 w-6 data-[state=checked]:translate-x-5",
      },
    };

    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={switchId}
            className={cn(
              "relative inline-flex cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:ring-2 focus-within:ring-project-green-800 focus-within:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "bg-gray-200 peer-checked:bg-project-green-800",
              sizeClasses[size].track,
              className
            )}
          >
            <span
              className={cn(
                "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
                "translate-x-0 peer-checked:translate-x-5",
                sizeClasses[size].thumb
              )}
            />
          </label>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
