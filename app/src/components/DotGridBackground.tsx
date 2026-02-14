import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface DotGridBackgroundProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export const DotGridBackground = forwardRef<HTMLDivElement, DotGridBackgroundProps>(
  ({ className, variant = 'dark' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 pointer-events-none z-0',
          variant === 'dark' && 'dot-grid bg-background',
          variant === 'light' && 'grid-lines bg-surface-light',
          className
        )}
        aria-hidden="true"
      />
    );
  }
);

DotGridBackground.displayName = 'DotGridBackground';
