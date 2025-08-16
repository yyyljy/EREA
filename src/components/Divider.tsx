interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className = "" }: DividerProps) {
  if (text) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="flex-grow border-t border-avax-border"></div>
        <span className="flex-shrink mx-4 px-2 text-erea-text-light bg-white text-sm font-medium">
          {text}
        </span>
        <div className="flex-grow border-t border-avax-border"></div>
      </div>
    );
  }

  return <hr className={`border-avax-border ${className}`} />;
}
