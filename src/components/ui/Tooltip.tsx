import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 700,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delayDuration);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getTooltipPosition = () => {
    const positions = {
      top: {
        base: "bottom-full mb-2",
        align: {
          start: "left-0",
          center: "left-1/2 -translate-x-1/2",
          end: "right-0",
        },
      },
      bottom: {
        base: "top-full mt-2",
        align: {
          start: "left-0",
          center: "left-1/2 -translate-x-1/2",
          end: "right-0",
        },
      },
      left: {
        base: "right-full mr-2",
        align: {
          start: "top-0",
          center: "top-1/2 -translate-y-1/2",
          end: "bottom-0",
        },
      },
      right: {
        base: "left-full ml-2",
        align: {
          start: "top-0",
          center: "top-1/2 -translate-y-1/2",
          end: "bottom-0",
        },
      },
    };

    return `${positions[side].base} ${positions[side].align[align]}`;
  };

  const getArrowPosition = () => {
    const arrows = {
      top: {
        base: "top-full left-1/2 -translate-x-1/2",
        border: "border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
      },
      bottom: {
        base: "bottom-full left-1/2 -translate-x-1/2",
        border: "border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
      },
      left: {
        base: "left-full top-1/2 -translate-y-1/2",
        border: "border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
      },
      right: {
        base: "right-full top-1/2 -translate-y-1/2",
        border: "border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",
      },
    };

    return arrows[side];
  };

  const arrow = getArrowPosition();

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap",
            getTooltipPosition(),
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrow.base,
              arrow.border
            )}
          />
        </div>
      )}
    </div>
  );
};

export { Tooltip };
