import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: ReactNode;
  label?: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ActionButton = ({ 
  icon, 
  label, 
  count, 
  active = false, 
  onClick,
  className 
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
        "text-white/90 hover:text-white",
        active && "text-primary",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full glass-dark flex items-center justify-center",
        "transition-all duration-200",
        active && "bg-primary/20 ring-2 ring-primary"
      )}>
        {icon}
      </div>
      {(label || count !== undefined) && (
        <span className="text-xs font-medium text-shadow-sm">
          {count !== undefined ? count.toLocaleString() : label}
        </span>
      )}
    </button>
  );
};
