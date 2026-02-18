import { cn } from '@/lib/utils';
import { formatDimensions, formatWeight, checkFit, checkWeightFit, convertToCm } from '@/lib/fitLogic';
import { OutcomeBadge } from './OutcomeBadge';
import type { BagAllowance, BagType, Dimensions, Unit, WeightUnit } from '@/types';
import { Ruler, Weight, StickyNote, Luggage, Backpack, Package, CheckCircle2, Tag } from 'lucide-react';

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

function InclusionBadge({ allowance }: { allowance: BagAllowance }) {
  if (allowance.included === true) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-accent/15 text-accent border border-accent/30">
        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
        FREE
      </span>
    );
  }
  if (allowance.included === false && allowance.fee) {
    const { min, currency } = allowance.fee;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Tag className="w-3 h-3" aria-hidden="true" />
        From {currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'NZD' ? 'NZ$' : currency === 'AUD' ? 'A$' : '€'}{min}
      </span>
    );
  }
  return null;
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
  const rawDims = userDimensions
    ? [userDimensions.l, userDimensions.w, userDimensions.h]
    : null;
  const dimOutcome = rawDims
    ? checkFit(unit === 'in' ? convertToCm(rawDims) : rawDims, allowance.maxCm)
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

      {/* Inclusion badge */}
      {allowance.included !== undefined && (
        <div className="mb-3">
          <InclusionBadge allowance={allowance} />
        </div>
      )}

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
            {wOutcome && <span className="sr-only"> — {wOutcome === 'fits' ? 'within limit' : 'over limit'}</span>}
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
