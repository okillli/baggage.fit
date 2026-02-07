import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UnitToggleProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  className?: string;
}

export function UnitToggle<T extends string>({
  value,
  options,
  onChange,
  className,
}: UnitToggleProps<T>) {
  const instanceId = useId();

  return (
    <div
      className={cn(
        'inline-flex items-center bg-white/5 rounded-lg p-1 border border-white/10',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === option ? 'text-background' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === option && (
            <motion.div
              layoutId={`unitToggle-${instanceId}`}
              className="absolute inset-0 bg-accent rounded-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{option}</span>
        </button>
      ))}
    </div>
  );
}
