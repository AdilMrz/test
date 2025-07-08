import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onValueChange, placeholder = "Select an option", disabled = false, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      options.find(option => option.value === value) || null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      setSelectedOption(option);
      setIsOpen(false);
      onValueChange?.(option.value);
    };

    return (
      <div className={cn("relative", className)} ref={ref}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-project-green-800 focus:border-project-green-800 disabled:cursor-not-allowed disabled:opacity-50",
            isOpen && "ring-2 ring-project-green-800 border-project-green-800"
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={cn(
            selectedOption ? "text-gray-900" : "text-gray-400"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon 
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <ul className="max-h-60 overflow-auto py-1" role="listbox">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm transition-colors duration-150",
                    option.disabled 
                      ? "cursor-not-allowed text-gray-400" 
                      : "hover:bg-project-green-50 hover:text-project-green-800",
                    selectedOption?.value === option.value && "bg-project-green-50 text-project-green-800"
                  )}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                >
                  <span className="block truncate">{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckIcon className="h-4 w-4 text-project-green-800" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
