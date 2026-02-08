import { cn } from '@/lib/utils';
import type { FitOutcome } from '@/types';
import { Check, X, HelpCircle } from 'lucide-react';

interface OutcomeBadgeProps {
  outcome: FitOutcome;
  variant?: 'dark' | 'light';
  className?: string;
  showIcon?: boolean;
}

const darkConfig = {
  fits: 'bg-accent text-background',
  'doesnt-fit': 'bg-transparent border-2 border-red-500 text-white',
  unknown: 'bg-transparent border-2 border-white/30 text-white/70',
};

const lightConfig = {
  fits: 'bg-accent text-background',
  'doesnt-fit': 'bg-transparent border-2 border-red-500 text-red-600',
  unknown: 'bg-transparent border-2 border-background/30 text-background/50',
};

const icons = {
  fits: Check,
  'doesnt-fit': X,
  unknown: HelpCircle,
};

const labels = {
  fits: 'Fits',
  'doesnt-fit': "Doesn't fit",
  unknown: 'Unknown',
};

export function OutcomeBadge({ outcome, variant = 'dark', className, showIcon = true }: OutcomeBadgeProps) {
  const config = variant === 'light' ? lightConfig : darkConfig;
  const Icon = icons[outcome];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
        config[outcome],
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {labels[outcome]}
    </span>
  );
}
