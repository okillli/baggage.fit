import { cn } from '@/lib/utils';
import type { FitOutcome } from '@/types';
import { Check, X, HelpCircle } from 'lucide-react';

interface OutcomeBadgeProps {
  outcome: FitOutcome;
  className?: string;
  showIcon?: boolean;
}

export function OutcomeBadge({ outcome, className, showIcon = true }: OutcomeBadgeProps) {
  const config = {
    fits: {
      icon: Check,
      text: 'Fits',
      className: 'bg-accent text-background',
    },
    'doesnt-fit': {
      icon: X,
      text: "Doesn't fit",
      className: 'bg-transparent border-2 border-red-500 text-white',
    },
    unknown: {
      icon: HelpCircle,
      text: 'Unknown',
      className: 'bg-transparent border-2 border-white/30 text-white/70',
    },
  };

  const { icon: Icon, text, className: badgeClassName } = config[outcome];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
        badgeClassName,
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {text}
    </span>
  );
}
