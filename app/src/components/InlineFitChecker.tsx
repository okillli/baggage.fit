import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { validateDimensions, convertToCm, checkWeightFit } from '@/lib/fitLogic';
import { DimensionInput } from '@/components/DimensionInput';
import { WeightInput } from '@/components/WeightInput';
import { OutcomeBadge } from '@/components/OutcomeBadge';
import { Check, X } from 'lucide-react';
import type { Airline, BagType, FitOutcome } from '@/types';

interface InlineFitCheckerProps {
  airline: Airline;
  className?: string;
}

export function InlineFitChecker({ airline, className }: InlineFitCheckerProps) {
  const {
    dimensions, unit, weight, weightUnit, bagType, setBagType,
    setDimensions, setUnit, setWeight, setWeightUnit,
  } = useAppStore();

  const isValid = validateDimensions(dimensions);

  const getResult = useCallback(
    (bt: BagType) => {
      if (!isValid) return null;
      const allowance = airline.allowances[bt];
      if (!allowance?.maxCm) return null;

      const rawDims = [dimensions.l, dimensions.w, dimensions.h];
      const userCm = unit === 'in' ? convertToCm(rawDims) : rawDims;
      const maxCm = allowance.maxCm;

      // Per-dimension comparison
      const userSorted = [...userCm].sort((a, b) => b - a);
      const maxSorted = [...maxCm].sort((a, b) => b - a);

      const dimResults = maxCm.length === 1
        ? [{ label: 'Total (L+W+H)', user: userCm.reduce((a, b) => a + b, 0), max: maxCm[0], fits: userCm.reduce((a, b) => a + b, 0) <= maxCm[0] }]
        : [
          { label: 'Height', user: userSorted[0], max: maxSorted[0], fits: userSorted[0] <= maxSorted[0] },
          { label: 'Width', user: userSorted[1], max: maxSorted[1], fits: userSorted[1] <= maxSorted[1] },
          { label: 'Depth', user: userSorted[2], max: maxSorted[2], fits: userSorted[2] <= maxSorted[2] },
        ];

      const dimFits = dimResults.every((d) => d.fits);
      const userWeightKg = weight != null && weight > 0
        ? (weightUnit === 'lb' ? weight * 0.453592 : weight)
        : null;
      const wOutcome = checkWeightFit(userWeightKg, allowance.maxKg);

      let overall: FitOutcome = 'unknown';
      if (!dimFits) overall = 'doesnt-fit';
      else if (wOutcome === 'doesnt-fit') overall = 'doesnt-fit';
      else if (dimFits && (wOutcome === 'fits' || wOutcome === 'unknown')) overall = 'fits';

      return { dimResults, dimFits, wOutcome, userWeightKg, maxKg: allowance.maxKg, overall };
    },
    [dimensions, unit, weight, weightUnit, airline, isValid]
  );

  const activeResult = getResult(bagType);

  const bagTypeOptions: { type: BagType; label: string }[] = [
    { type: 'cabin', label: 'Cabin bag' },
    { type: 'underseat', label: 'Underseat' },
    { type: 'checked', label: 'Checked' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="section-label">Check your bag</h3>

      {/* Bag type selector */}
      <div className="flex flex-wrap gap-2">
        {bagTypeOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setBagType(opt.type)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              bagType === opt.type
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-secondary border border-border rounded-xl p-4 space-y-4">
        <DimensionInput
          dimensions={dimensions}
          unit={unit}
          onChange={setDimensions}
          onUnitChange={setUnit}
        />
        <WeightInput
          weight={weight}
          weightUnit={weightUnit}
          onChange={setWeight}
          onUnitChange={setWeightUnit}
        />
      </div>

      {/* Result */}
      {isValid && activeResult && (
        <div className={cn(
          'rounded-xl p-4 space-y-3 border',
          activeResult.overall === 'fits' ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' :
          activeResult.overall === 'doesnt-fit' ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800' :
          'bg-secondary border-border'
        )}>
          <div className="flex items-center justify-between">
            <span className="font-heading font-bold text-sm">
              {activeResult.overall === 'fits' ? 'Your bag fits!' : "Your bag doesn't fit"}
            </span>
            <OutcomeBadge outcome={activeResult.overall} />
          </div>

          {/* Per-dimension breakdown */}
          <div className="space-y-1.5">
            {activeResult.dimResults.map((d) => (
              <DimensionRow key={d.label} label={d.label} user={d.user} max={d.max} unit={unit} fits={d.fits} />
            ))}
            {/* Weight row */}
            {activeResult.userWeightKg != null && activeResult.maxKg != null && (
              <DimensionRow
                label="Weight"
                user={weightUnit === 'lb' ? weight! : activeResult.userWeightKg}
                max={weightUnit === 'lb' ? activeResult.maxKg / 0.453592 : activeResult.maxKg}
                unit={weightUnit}
                fits={activeResult.wOutcome === 'fits'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DimensionRow({ label, user, max, unit, fits }: { label: string; user: number; max: number; unit: string; fits: boolean }) {
  const diff = Math.round((user - max) * 10) / 10;
  return (
    <div className="flex items-center gap-2 text-sm">
      {fits ? (
        <Check className="w-4 h-4 text-green-600 shrink-0" />
      ) : (
        <X className="w-4 h-4 text-red-500 shrink-0" />
      )}
      <span className="text-muted-foreground w-16 shrink-0">{label}:</span>
      <span className={cn('font-mono', fits ? 'text-foreground' : 'text-red-500 font-semibold')}>
        {Math.round(user * 10) / 10}
      </span>
      <span className="text-muted-foreground">{fits ? '≤' : '>'}</span>
      <span className="font-mono text-foreground">{Math.round(max * 10) / 10} {unit}</span>
      {!fits && (
        <span className="text-xs text-red-500 ml-1">({diff > 0 ? '+' : ''}{diff} over)</span>
      )}
    </div>
  );
}
