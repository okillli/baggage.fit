import { cn } from '@/lib/utils';
import type { Airline, BagType, Dimensions, FitResult, Unit, WeightUnit } from '@/types';
import { BagTypeAllowanceCard } from './BagTypeAllowanceCard';
import { OutcomeBadge } from './OutcomeBadge';
import { VisualSizer } from './VisualSizer';
import { ExternalLink, Shield } from 'lucide-react';

interface AirlineDetailContentProps {
  airline: Airline;
  result?: FitResult | null;
  userDimensions?: Dimensions | null;
  userWeightKg?: number | null;
  activeBagType?: BagType;
  unit: Unit;
  weightUnit: WeightUnit;
  className?: string;
}

export function AirlineDetailContent({
  airline,
  result,
  userDimensions,
  userWeightKg,
  activeBagType = 'cabin',
  unit,
  weightUnit,
  className,
}: AirlineDetailContentProps) {
  const countryFlag = countryToFlag(airline.country);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{countryFlag}</span>
        <div>
          <h2 className="font-heading font-bold text-xl">{airline.name}</h2>
          <p className="text-sm font-mono text-muted-foreground">{airline.code}</p>
        </div>
      </div>

      {/* Fit result (if user has checked this airline) */}
      {result && (
        <FitResultSummary result={result} unit={unit} weightUnit={weightUnit} />
      )}

      {/* All 3 bag types */}
      <div>
        <h3 className="section-label mb-3">Bag allowances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['cabin', 'underseat', 'checked'] as BagType[]).map((bt) => (
            <BagTypeAllowanceCard
              key={bt}
              bagType={bt}
              allowance={airline.allowances[bt]}
              isActive={bt === activeBagType}
              userDimensions={userDimensions}
              userWeightKg={userWeightKg}
              unit={unit}
              weightUnit={weightUnit}
            />
          ))}
        </div>
      </div>

      {/* Policy links */}
      <div className="space-y-2">
        <h3 className="section-label mb-2">Official links</h3>
        <a
          href={airline.links.policy}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Official baggage policy
        </a>
        {airline.links.calculator && (
          <a
            href={airline.links.calculator}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline ml-4"
          >
            <ExternalLink className="w-4 h-4" />
            Size calculator
          </a>
        )}
      </div>

      {/* Trust footer */}
      <div className="flex items-center gap-2 pt-4 border-t border-white/10 text-xs text-muted-foreground/60">
        <Shield className="w-3.5 h-3.5" />
        <span>Last verified: {airline.lastVerified}</span>
        <span className="mx-1">&middot;</span>
        <span>Sizes are published limits; enforcement varies.</span>
      </div>
    </div>
  );
}

function FitResultSummary({ result, unit, weightUnit }: { result: FitResult; unit: Unit; weightUnit: WeightUnit }) {
  const maxDims = result.maxDimensions as [number, number, number] | null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="section-label">Your fit result</span>
        <OutcomeBadge outcome={result.outcome} />
      </div>
      {maxDims && maxDims.length === 3 && (
        <div className="flex justify-center">
          <VisualSizer
            dimensions={{ l: result.userDimensions[0], w: result.userDimensions[1], h: result.userDimensions[2] }}
            maxDimensions={maxDims}
            unit={unit}
            outcome={result.outcome}
            userWeightKg={result.userWeightKg}
            maxWeightKg={result.maxWeightKg}
            weightOutcome={result.weightOutcome}
            weightUnit={weightUnit}
            className="w-full max-w-[280px] h-[200px]"
          />
        </div>
      )}
    </div>
  );
}

function countryToFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(
    ...code.split('').map((c) => c.charCodeAt(0) + 0x1F1A5)
  );
}
