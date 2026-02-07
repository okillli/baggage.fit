import { cn } from '@/lib/utils';
import type { FitResult, FitOutcome, Unit, WeightUnit } from '@/types';
import { OutcomeBadge } from './OutcomeBadge';
import { formatDimensions, formatWeight } from '@/lib/fitLogic';
import { ExternalLink, Ruler, Weight } from 'lucide-react';

interface FitResultCardProps {
  result: FitResult;
  unit: Unit;
  weightUnit?: WeightUnit;
  onClick?: () => void;
  className?: string;
}

export function FitResultCard({
  result,
  unit,
  weightUnit = 'kg',
  onClick,
  className,
}: FitResultCardProps) {
  const { airline, outcome, maxDimensions, dimensionOutcome, weightOutcome, userWeightKg, maxWeightKg } = result;

  const weightExplanation = getWeightExplanation(dimensionOutcome, weightOutcome, userWeightKg, maxWeightKg);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-white/5 border border-white/10 rounded-xl p-5',
        'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-lg">{airline.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{airline.code}</p>
        </div>
        <OutcomeBadge outcome={outcome} />
      </div>

      {/* Size comparison */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Max size:</span>
          <span className="font-mono">
            {formatDimensions(maxDimensions, unit)}
          </span>
        </div>

        {outcome !== 'unknown' && result.volumeDiff !== undefined && (
          <div className="text-xs pl-6">
            {result.volumeDiff <= 0 ? (
              <span className="text-accent">
                Your bag is {Math.abs(result.volumeDiff)}% smaller than max
              </span>
            ) : (
              <span className="text-red-400">
                Your bag is {result.volumeDiff}% larger than max
              </span>
            )}
          </div>
        )}

        {/* Weight comparison */}
        <div className="flex items-center gap-2 text-sm">
          <Weight className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Max weight:</span>
          <span className="font-mono">
            {formatWeight(maxWeightKg, weightUnit)}
          </span>
        </div>

        {userWeightKg !== null && maxWeightKg !== null && (
          <div className="text-xs pl-6">
            {weightOutcome === 'fits' ? (
              <span className="text-accent">
                Your bag: {formatWeight(userWeightKg, weightUnit)} — fits
              </span>
            ) : (
              <span className="text-red-400">
                Your bag: {formatWeight(userWeightKg, weightUnit)} — {formatWeight(userWeightKg - maxWeightKg, weightUnit)} over
              </span>
            )}
          </div>
        )}

        {weightExplanation && (
          <p className="text-xs text-muted-foreground/80 pl-6 italic">
            {weightExplanation}
          </p>
        )}
      </div>

      {/* Actions */}
      <a
        href={airline.links.policy}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'inline-flex items-center gap-2 text-sm text-accent hover:underline',
          'transition-opacity opacity-80 hover:opacity-100'
        )}
      >
        <ExternalLink className="w-4 h-4" />
        Official policy
      </a>

      {/* Last verified */}
      <p className="mt-3 text-xs text-muted-foreground/60">
        Last verified: {airline.lastVerified}
      </p>
    </div>
  );
}

function getWeightExplanation(
  dimOutcome: FitOutcome,
  weightOutcome: FitOutcome,
  userWeightKg: number | null,
  maxWeightKg: number | null,
): string | null {
  if (userWeightKg === null || maxWeightKg === null) return null;
  if (dimOutcome === 'fits' && weightOutcome === 'doesnt-fit') {
    return 'Size fits but overweight';
  }
  if (dimOutcome === 'doesnt-fit' && weightOutcome === 'fits') {
    return 'Weight OK but too large';
  }
  return null;
}
