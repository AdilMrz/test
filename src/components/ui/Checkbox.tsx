import React from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "@heroicons/react/24/outline";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white text-project-green-800 focus:outline-none focus:ring-2 focus:ring-project-green-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "checked:bg-project-green-800 checked:border-project-green-800",
              className
            )}
            {...props}
          />
          <CheckIcon className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5 top-0.5" />
        </div>
        
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
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

Checkbox.displayName = "Checkbox";

export { Checkbox };
