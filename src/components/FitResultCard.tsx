import { cn } from '@/lib/utils';
import type { FitResult, Unit } from '@/types';
import { OutcomeBadge } from './OutcomeBadge';
import { formatDimensions } from '@/lib/fitLogic';
import { ExternalLink, Ruler } from 'lucide-react';

interface FitResultCardProps {
  result: FitResult;
  unit: Unit;
  className?: string;
}

export function FitResultCard({ result, unit, className }: FitResultCardProps) {
  const { airline, outcome, maxDimensions } = result;

  return (
    <div
      className={cn(
        'group relative bg-white/5 border border-white/10 rounded-xl p-5',
        'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30',
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
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Max size:</span>
          <span className="font-mono">
            {formatDimensions(maxDimensions, unit)}
          </span>
        </div>
        
        {outcome !== 'unknown' && result.volumeDiff !== undefined && (
          <div className="text-xs">
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
      </div>

      {/* Actions */}
      <a
        href={airline.links.policy}
        target="_blank"
        rel="noopener noreferrer"
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
