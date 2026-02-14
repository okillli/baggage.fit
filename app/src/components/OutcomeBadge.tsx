import { cn } from '@/lib/utils';
import type { FitOutcome } from '@/types';
import { getOutcomeText, getOutcomeColor } from '@/lib/fitLogic';
import { Check, X, HelpCircle } from 'lucide-react';

interface OutcomeBadgeProps {
  outcome: FitOutcome;
  variant?: 'dark' | 'light';
  className?: string;
  showIcon?: boolean;
}

const icons = {
  fits: Check,
  'doesnt-fit': X,
  unknown: HelpCircle,
};

export function OutcomeBadge({ outcome, variant = 'dark', className, showIcon = true }: OutcomeBadgeProps) {
  const Icon = icons[outcome];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold',
        getOutcomeColor(outcome, variant),
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {getOutcomeText(outcome)}
    </span>
  );
}
