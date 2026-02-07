import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Airline, BagType, SortOption, Unit } from '@/types';
import { calculateSizeMetric, formatDimensions } from '@/lib/fitLogic';
import { Ruler, Weight, Search, ExternalLink, Crown } from 'lucide-react';

interface CompareTableProps {
  airlines: Airline[];
  bagType: BagType;
  sort: SortOption;
  unit: Unit;
  userWeightKg?: number | null;
  onAirlineClick?: (code: string) => void;
  className?: string;
}

export function CompareTable({
  airlines,
  bagType,
  sort,
  unit,
  userWeightKg,
  onAirlineClick,
  className,
}: CompareTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAirlines = useMemo(() => {
    const withAllowance = airlines
      .map((airline) => ({
        airline,
        allowance: airline.allowances[bagType],
      }))
      .filter((item) => item.allowance);

    // Apply search filter
    const filtered = searchQuery
      ? withAllowance.filter(
          ({ airline }) =>
            airline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            airline.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : withAllowance;

    return filtered.sort((a, b) => {
      const aDims = a.allowance?.maxCm;
      const bDims = b.allowance?.maxCm;

      switch (sort) {
        case 'largest':
          if (!aDims) return 1;
          if (!bDims) return -1;
          return calculateSizeMetric(bDims) - calculateSizeMetric(aDims);
        case 'strictest':
          if (!aDims) return 1;
          if (!bDims) return -1;
          return calculateSizeMetric(aDims) - calculateSizeMetric(bDims);
        case 'alphabetical':
        default:
          return a.airline.name.localeCompare(b.airline.name);
      }
    });
  }, [airlines, bagType, sort, searchQuery]);

  if (sortedAirlines.length === 0) {
    return (
      <div className={cn('text-center py-10', className)}>
        <p className="text-background/60">No airlines found with data for this bag type.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-background/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search airline..."
          className="w-full max-w-md bg-white border border-background/20 rounded-lg pl-10 pr-4 py-2 text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-background/10 bg-white">
        <table className="w-full">
          <thead className="bg-background/5">
            <tr className="border-b border-background/10">
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">Airline</th>
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Max Size
                </span>
              </th>
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Weight
                </span>
              </th>
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">Notes</th>
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedAirlines.map(({ airline, allowance }, index) => {
              const isBest = sort === 'largest' && index === 0 && !searchQuery;
              return (
                <tr
                  key={airline.code}
                  className={cn(
                    'border-b border-background/5 transition-colors hover:bg-background/5',
                    isBest && 'bg-accent/10 hover:bg-accent/15'
                  )}
                >
                  <td className="py-4 px-4">
                    <div
                      className={cn(
                        'flex items-center gap-3',
                        onAirlineClick && 'cursor-pointer hover:text-accent transition-colors'
                      )}
                      onClick={() => onAirlineClick?.(airline.code)}
                    >
                      {isBest && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent text-background text-xs font-bold rounded">
                          <Crown className="w-3 h-3" />
                          BEST
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-background">{airline.name}</p>
                        <p className="text-xs text-background/50 font-mono">{airline.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-background/80">
                    {formatDimensions(allowance?.maxCm || null, unit)}
                  </td>
                  <td className={cn(
                    'py-4 px-4',
                    getWeightCellColor(userWeightKg, allowance?.maxKg)
                  )}>
                    {allowance?.maxKg ? `${allowance.maxKg} kg` : '—'}
                  </td>
                  <td className="py-4 px-4 text-sm text-background/60 max-w-xs truncate">
                    {allowance?.notes || '—'}
                  </td>
                  <td className="py-4 px-4">
                    <a
                      href={airline.links.policy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Policy
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedAirlines.map(({ airline, allowance }, index) => {
          const isBest = sort === 'largest' && index === 0 && !searchQuery;
          return (
            <div
              key={airline.code}
              className={cn(
                'bg-white border border-background/10 rounded-lg p-4',
                isBest && 'border-accent/50 bg-accent/5'
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-between mb-3',
                  onAirlineClick && 'cursor-pointer'
                )}
                onClick={() => onAirlineClick?.(airline.code)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {isBest && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-accent text-background text-xs font-bold rounded">
                        <Crown className="w-3 h-3" />
                      </span>
                    )}
                    <p className="font-heading font-bold text-background">{airline.name}</p>
                  </div>
                  <p className="text-xs text-background/50 font-mono">{airline.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-background/50 text-xs mb-1">Max Size</p>
                  <p className="font-mono text-background/80">{formatDimensions(allowance?.maxCm || null, unit)}</p>
                </div>
                <div>
                  <p className="text-background/50 text-xs mb-1">Weight</p>
                  <p className={cn('text-background/80', getWeightCellColor(userWeightKg, allowance?.maxKg))}>
                    {allowance?.maxKg ? `${allowance.maxKg} kg` : '—'}
                  </p>
                </div>
              </div>
              {allowance?.notes && (
                <p className="text-xs text-background/60 mb-3">{allowance.notes}</p>
              )}
              <a
                href={airline.links.policy}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View policy
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getWeightCellColor(
  userWeightKg: number | null | undefined,
  maxKg: number | null | undefined,
): string {
  if (userWeightKg == null || !maxKg) return 'text-background/80';
  return userWeightKg <= maxKg ? 'text-green-600 font-medium' : 'text-red-500 font-medium';
}
