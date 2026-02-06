import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Unit } from '@/types';

interface UnitToggleProps {
  value: Unit;
  onChange: (unit: Unit) => void;
  className?: string;
}

export function UnitToggle({ value, onChange, className }: UnitToggleProps) {
  return (
    <div 
      className={cn(
        'inline-flex items-center bg-white/5 rounded-lg p-1 border border-white/10',
        className
      )}
    >
      {(['cm', 'in'] as Unit[]).map((unit) => (
        <button
          key={unit}
          onClick={() => onChange(unit)}
          className={cn(
            'relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === unit ? 'text-background' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === unit && (
            <motion.div
              layoutId="unitToggle"
              className="absolute inset-0 bg-accent rounded-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{unit}</span>
        </button>
      ))}
    </div>
  );
}
