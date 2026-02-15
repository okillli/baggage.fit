import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { validateDimensions, checkBagTypeFit, convertKgToLb } from '@/lib/fitLogic';
import { DimensionInput } from '@/components/DimensionInput';
import { WeightInput } from '@/components/WeightInput';
import { OutcomeBadge } from '@/components/OutcomeBadge';
import { Check, X } from 'lucide-react';
import type { Airline, BagType } from '@/types';

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

  const activeResult = useMemo(() => {
    if (!isValid) return null;
    return checkBagTypeFit(
      [dimensions.l, dimensions.w, dimensions.h],
      unit, weight, weightUnit,
      airline.allowances[bagType],
    );
  }, [dimensions, unit, weight, weightUnit, airline, bagType, isValid]);

  const bagTypeOptions: { type: BagType; label: string }[] = [
    { type: 'cabin', label: 'Cabin bag' },
    { type: 'underseat', label: 'Underseat' },
    { type: 'checked', label: 'Checked' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="section-label">Check your bag</h3>

      {/* Bag type selector */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Bag type">
        {bagTypeOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setBagType(opt.type)}
            className={cn(
              'px-3 py-1.5 min-h-[44px] rounded-lg text-sm font-medium transition-all',
              bagType === opt.type
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80'
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
        <div
          className={cn(
            'rounded-xl p-4 space-y-3 border',
            activeResult.overall === 'fits' ? 'bg-accent/10 border-accent/30' :
            activeResult.overall === 'doesnt-fit' ? 'bg-destructive/10 border-destructive/30' :
            'bg-secondary border-border'
          )}
          aria-live="polite"
          aria-atomic="true"
        >
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
                user={weightUnit === 'lb' ? (weight ?? 0) : activeResult.userWeightKg}
                max={weightUnit === 'lb' ? convertKgToLb(activeResult.maxKg) : activeResult.maxKg}
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
        <Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
      ) : (
        <X className="w-4 h-4 text-destructive shrink-0" aria-hidden="true" />
      )}
      <span className="sr-only">{label} {fits ? 'fits' : 'exceeds limit'}</span>
      <span className="text-muted-foreground w-16 shrink-0">{label}:</span>
      <span className={cn('font-mono', fits ? 'text-foreground' : 'text-destructive font-semibold')}>
        {Math.round(user * 10) / 10}
      </span>
      <span className="text-muted-foreground">{fits ? '≤' : '>'}</span>
      <span className="font-mono text-foreground">{Math.round(max * 10) / 10} {unit}</span>
      {!fits && (
        <span className="text-xs text-destructive ml-1">({diff > 0 ? '+' : ''}{diff} over)</span>
      )}
    </div>
  );
}
