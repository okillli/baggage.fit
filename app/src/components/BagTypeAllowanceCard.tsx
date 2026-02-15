import { cn } from '@/lib/utils';
import { formatDimensions, formatWeight, checkFit, checkWeightFit } from '@/lib/fitLogic';
import { OutcomeBadge } from './OutcomeBadge';
import type { BagAllowance, BagType, Dimensions, Unit, WeightUnit } from '@/types';
import { Ruler, Weight, StickyNote, Luggage, Backpack, Package } from 'lucide-react';

const bagTypeConfig: Record<BagType, { label: string; icon: typeof Luggage }> = {
  cabin: { label: 'Cabin Bag', icon: Luggage },
  underseat: { label: 'Under-Seat Bag', icon: Backpack },
  checked: { label: 'Checked Bag', icon: Package },
};

interface BagTypeAllowanceCardProps {
  bagType: BagType;
  allowance: BagAllowance | undefined;
  isActive?: boolean;
  userDimensions?: Dimensions | null;
  userWeightKg?: number | null;
  unit: Unit;
  weightUnit: WeightUnit;
  className?: string;
}

export function BagTypeAllowanceCard({
  bagType,
  allowance,
  isActive = false,
  userDimensions,
  userWeightKg,
  unit,
  weightUnit,
  className,
}: BagTypeAllowanceCardProps) {
  const config = bagTypeConfig[bagType];
  const Icon = config.icon;

  if (!allowance) {
    return (
      <div className={cn(
        'bg-secondary border border-border rounded-xl p-4 opacity-50',
        className
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <p className="font-heading font-bold text-sm">{config.label}</p>
        </div>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Inline fit check if user has dimensions
  const dimOutcome = userDimensions
    ? checkFit(
        unit === 'in'
          ? [userDimensions.l * 2.54, userDimensions.w * 2.54, userDimensions.h * 2.54]
          : [userDimensions.l, userDimensions.w, userDimensions.h],
        allowance.maxCm
      )
    : null;

  const wOutcome = userWeightKg != null
    ? checkWeightFit(userWeightKg, allowance.maxKg)
    : null;

  return (
    <div className={cn(
      'bg-secondary border rounded-xl p-4 transition-colors',
      isActive ? 'border-accent/40' : 'border-border',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
          <p className="font-heading font-bold text-sm">{config.label}</p>
        </div>
        {dimOutcome && <OutcomeBadge outcome={dimOutcome} className="text-xs py-0.5 px-2" />}
      </div>

      {/* Dimensions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className="font-mono">
            {formatDimensions(allowance.maxCm, unit)}
          </span>
        </div>

        {/* Weight */}
        <div className="flex items-center gap-2 text-sm">
          <Weight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className={cn(
            'font-mono',
            wOutcome === 'fits' && 'text-accent',
            wOutcome === 'doesnt-fit' && 'text-destructive',
          )}>
            {formatWeight(allowance.maxKg, weightUnit)}
          </span>
        </div>

        {/* Notes */}
        {allowance.notes && (
          <div className="flex items-start gap-2 text-sm mt-2 pt-2 border-t border-border/50">
            <StickyNote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              {allowance.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
