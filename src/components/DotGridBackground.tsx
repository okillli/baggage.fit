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
          variant === 'dark' && 'dot-grid bg-[#1A1A1A]',
          variant === 'light' && 'grid-lines bg-[#F2F2F2]',
          className
        )}
        aria-hidden="true"
      />
    );
  }
);

DotGridBackground.displayName = 'DotGridBackground';
