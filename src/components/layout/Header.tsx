interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <div className="avax-header shadow-lg mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with notice */}
        <div className="border-b border-white/20 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/80">
              This is Demo Site
            </div>
            <div className="text-white/80">
              Secure • Verified • Transparent
            </div>
          </div>
        </div>
        
        {/* Main header */}
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="avax-seal">
              EREA
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <span className="text-sm text-white/80 block">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
