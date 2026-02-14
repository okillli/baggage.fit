import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { airlineToSlug } from '@/lib/slugs';
import { countryToFlag } from '@/lib/format';
import type { Airline, BagType, FitResult, SortOption, Unit, WeightUnit } from '@/types';
import { calculateSizeMetric, formatDimensions, formatWeight } from '@/lib/fitLogic';
import { OutcomeBadge } from '@/components/OutcomeBadge';
import { Search, Crown } from 'lucide-react';

interface CompareTableProps {
  airlines: Airline[];
  bagType: BagType;
  sort: SortOption;
  unit: Unit;
  weightUnit?: WeightUnit;
  userWeightKg?: number | null;
  fitResults?: FitResult[];
  onAirlineClick?: (code: string) => void;
  className?: string;
}

export function CompareTable({
  airlines,
  bagType,
  sort,
  unit,
  weightUnit = 'kg',
  userWeightKg: _userWeightKg,
  fitResults,
  onAirlineClick,
  className,
}: CompareTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fitMap = useMemo(() => {
    if (!fitResults || fitResults.length === 0) return null;
    const map = new Map<string, FitResult>();
    for (const r of fitResults) map.set(r.airline.code, r);
    return map;
  }, [fitResults]);

  const sortedAirlines = useMemo(() => {
    let list = [...airlines];

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      const aDims = a.allowances[bagType]?.maxCm;
      const bDims = b.allowances[bagType]?.maxCm;
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
          return a.name.localeCompare(b.name);
      }
    });
  }, [airlines, bagType, sort, searchQuery]);

  const handleClick = (airline: Airline) => {
    if (onAirlineClick) {
      onAirlineClick(airline.code);
    } else {
      navigate(`/airlines/${airlineToSlug(airline.name)}`);
    }
  };

  if (sortedAirlines.length === 0) {
    const message = searchQuery
      ? `No airlines matching "${searchQuery}".`
      : airlines.length === 0
      ? 'No airlines match your current filters.'
      : 'No airlines found.';
    return (
      <div className={cn('text-center py-10', className)}>
        <p className="text-foreground/60">{message}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search airline..."
          aria-label="Search airlines in table"
          className="w-full max-w-md bg-white border border-foreground/20 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Desktop Table — all 3 bag types */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-foreground/10 bg-white">
        <table className="w-full">
          <caption className="sr-only">Airline baggage size and weight limits</caption>
          <thead className="bg-foreground/5">
            <tr className="border-b border-foreground/10">
              <th className="text-left py-3 px-4 font-heading text-sm font-semibold">Airline</th>
              <th className="text-left py-3 px-3 font-heading text-xs font-semibold">Underseat</th>
              <th className="text-left py-3 px-3 font-heading text-xs font-semibold">Cabin</th>
              <th className="text-left py-3 px-3 font-heading text-xs font-semibold">Checked</th>
              {fitMap && <th className="text-left py-3 px-3 font-heading text-xs font-semibold">Fit</th>}
            </tr>
          </thead>
          <tbody>
            {sortedAirlines.map((airline, index) => {
              const isBest = sort === 'largest' && index === 0 && !searchQuery;
              const fit = fitMap?.get(airline.code);
              return (
                <tr
                  key={airline.code}
                  className={cn(
                    'border-b border-foreground/5 transition-colors hover:bg-foreground/5 cursor-pointer',
                    isBest && 'bg-accent/10 hover:bg-accent/15'
                  )}
                  onClick={() => handleClick(airline)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{countryToFlag(airline.country)}</span>
                      {isBest && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-accent text-foreground text-xs font-bold rounded">
                          <Crown className="w-3 h-3" />
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-foreground text-sm">{airline.name}</p>
                        <p className="text-xs text-foreground/50 font-mono">{airline.code}</p>
                      </div>
                    </div>
                  </td>
                  <BagTypeCell allowance={airline.allowances.underseat} unit={unit} weightUnit={weightUnit} />
                  <BagTypeCell allowance={airline.allowances.cabin} unit={unit} weightUnit={weightUnit} />
                  <BagTypeCell allowance={airline.allowances.checked} unit={unit} weightUnit={weightUnit} />
                  {fitMap && (
                    <td className="py-3 px-3">
                      {fit && <OutcomeBadge outcome={fit.outcome} variant="light" className="text-xs px-2 py-1" />}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards — all 3 bag types stacked */}
      <div className="lg:hidden space-y-3">
        {sortedAirlines.map((airline, index) => {
          const isBest = sort === 'largest' && index === 0 && !searchQuery;
          const fit = fitMap?.get(airline.code);
          return (
            <button
              key={airline.code}
              type="button"
              onClick={() => handleClick(airline)}
              className={cn(
                'w-full text-left bg-white border border-foreground/10 rounded-lg p-4',
                isBest && 'border-accent/50 bg-accent/5'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{countryToFlag(airline.country)}</span>
                  {isBest && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-accent text-foreground text-xs font-bold rounded">
                      <Crown className="w-3 h-3" />
                    </span>
                  )}
                  <div>
                    <p className="font-heading font-bold text-foreground">{airline.name}</p>
                    <p className="text-xs text-foreground/50 font-mono">{airline.code}</p>
                  </div>
                </div>
                {fit && <OutcomeBadge outcome={fit.outcome} variant="light" className="text-xs px-2 py-1" />}
              </div>
              <div className="space-y-1.5 text-sm">
                <BagTypeMobileRow label="Underseat" allowance={airline.allowances.underseat} unit={unit} weightUnit={weightUnit} />
                <BagTypeMobileRow label="Cabin" allowance={airline.allowances.cabin} unit={unit} weightUnit={weightUnit} />
                <BagTypeMobileRow label="Checked" allowance={airline.allowances.checked} unit={unit} weightUnit={weightUnit} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BagTypeCell({ allowance, unit, weightUnit }: {
  allowance?: { maxCm: number[] | null; maxKg: number | null; notes?: string };
  unit: Unit; weightUnit: WeightUnit;
}) {
  if (!allowance) {
    return <td className="py-3 px-3 text-xs text-foreground/30">&mdash;</td>;
  }
  return (
    <td className="py-3 px-3">
      <p className="font-mono text-xs text-foreground/80">{formatDimensions(allowance.maxCm, unit)}</p>
      <p className="text-xs text-foreground/50">{allowance.maxKg ? formatWeight(allowance.maxKg, weightUnit) : 'No limit'}</p>
    </td>
  );
}

function BagTypeMobileRow({ label, allowance, unit, weightUnit }: {
  label: string;
  allowance?: { maxCm: number[] | null; maxKg: number | null; notes?: string };
  unit: Unit; weightUnit: WeightUnit;
}) {
  if (!allowance) {
    return (
      <div className="flex justify-between text-foreground/30">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs">&mdash;</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs font-medium text-foreground/60">{label}</span>
      <span className="font-mono text-xs text-foreground/80">
        {formatDimensions(allowance.maxCm, unit)}
        {allowance.maxKg ? ` / ${formatWeight(allowance.maxKg, weightUnit)}` : ''}
      </span>
    </div>
  );
}
