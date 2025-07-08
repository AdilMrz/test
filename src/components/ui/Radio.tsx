import React from "react";
import { cn } from "../../utils/cn";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ options, value, onValueChange, name, className, orientation = "vertical" }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-3",
          orientation === "horizontal" && "flex space-x-6 space-y-0",
          className
        )}
        role="radiogroup"
      >
        {options.map((option) => (
          <RadioItem
            key={option.value}
            option={option}
            name={name}
            checked={value === option.value}
            onValueChange={onValueChange}
          />
        ))}
      </div>
    );
  }
);

interface RadioItemProps {
  option: RadioOption;
  name: string;
  checked: boolean;
  onValueChange?: (value: string) => void;
}

const RadioItem: React.FC<RadioItemProps> = ({ option, name, checked, onValueChange }) => {
  const radioId = `${name}-${option.value}`;

  return (
    <div className="flex items-start space-x-3">
      <div className="relative flex items-center">
        <input
          type="radio"
          id={radioId}
          name={name}
          value={option.value}
          checked={checked}
          disabled={option.disabled}
          onChange={(e) => onValueChange?.(e.target.value)}
          className={cn(
            "h-4 w-4 border border-gray-300 text-project-green-800 focus:ring-2 focus:ring-project-green-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "checked:bg-project-green-800 checked:border-project-green-800"
          )}
        />
        <div className="absolute inset-0 rounded-full border border-gray-300 peer-checked:border-project-green-800 peer-checked:bg-project-green-800">
          <div className={cn(
            "absolute inset-1 rounded-full bg-white transition-opacity duration-150",
            checked ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <label
          htmlFor={radioId}
          className={cn(
            "text-sm font-medium cursor-pointer",
            option.disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"
          )}
        >
          {option.label}
        </label>
        {option.description && (
          <p className={cn(
            "text-sm",
            option.disabled ? "text-gray-300" : "text-gray-600"
          )}>
            {option.description}
          </p>
        )}
      </div>
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
