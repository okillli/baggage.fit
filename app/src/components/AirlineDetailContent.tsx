import { cn } from '@/lib/utils';
import { countryToFlag } from '@/lib/format';
import type { Airline, BagType, Dimensions, Unit, WeightUnit } from '@/types';
import { BagTypeAllowanceCard } from './BagTypeAllowanceCard';
import { InlineFitChecker } from './InlineFitChecker';
import { RecommendedBags } from './RecommendedBags';
import { ExternalLink, Shield } from 'lucide-react';

interface AirlineDetailContentProps {
  airline: Airline;
  userDimensions?: Dimensions | null;
  userWeightKg?: number | null;
  activeBagType?: BagType;
  unit: Unit;
  weightUnit: WeightUnit;
  headingLevel?: 'h1' | 'h2';
  showFitChecker?: boolean;
  hideHeader?: boolean;
  className?: string;
}

export function AirlineDetailContent({
  airline,
  userDimensions,
  userWeightKg,
  activeBagType = 'cabin',
  unit,
  weightUnit,
  headingLevel = 'h2',
  showFitChecker = false,
  hideHeader = false,
  className,
}: AirlineDetailContentProps) {
  const countryFlag = countryToFlag(airline.country);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{countryFlag}</span>
          <div>
            {headingLevel === 'h1' ? (
              <h1 className="font-heading font-bold text-xl">{airline.name}</h1>
            ) : (
              <h2 className="font-heading font-bold text-xl">{airline.name}</h2>
            )}
            <p className="text-sm font-mono text-muted-foreground">{airline.code}</p>
          </div>
        </div>
      )}

      {/* All 3 bag types */}
      <div>
        {headingLevel === 'h1' ? (
          <h2 className="section-label mb-3">Bag allowances</h2>
        ) : (
          <h3 className="section-label mb-3">Bag allowances</h3>
        )}
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

      {/* Inline fit checker */}
      {showFitChecker && (
        <InlineFitChecker airline={airline} />
      )}

      {/* Recommended bags (affiliate) */}
      {showFitChecker && (
        <RecommendedBags airline={airline} bagType={activeBagType} className="pt-2" />
      )}

      {/* Policy links */}
      <div className="space-y-2">
        {headingLevel === 'h1' ? (
          <h2 className="section-label mb-2">Official links</h2>
        ) : (
          <h3 className="section-label mb-2">Official links</h3>
        )}
        <div className="flex flex-wrap gap-4">
          <a
            href={airline.links.policy}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent-on-light hover:underline"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Official baggage policy
            <span className="sr-only">(opens in new tab)</span>
          </a>
          {airline.links.calculator && (
            <a
              href={airline.links.calculator}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent-on-light hover:underline"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Size calculator
              <span className="sr-only">(opens in new tab)</span>
            </a>
          )}
        </div>
      </div>

      {/* Trust footer */}
      <div className="flex items-center gap-2 pt-4 border-t border-border text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Last verified: {airline.lastVerified}</span>
        <span className="mx-1">&middot;</span>
        <span>Sizes are published limits; enforcement varies.</span>
      </div>
    </div>
  );
}

