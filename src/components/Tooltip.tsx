import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${getPositionClasses()}`}
      >
        <div className="bg-avax-dark text-white text-sm rounded-md px-3 py-2 whitespace-nowrap shadow-lg">
          {content}
          <div className="absolute w-2 h-2 bg-avax-dark transform rotate-45 -translate-x-1/2 left-1/2 top-full"></div>
        </div>
      </div>
    </div>
  );
}
