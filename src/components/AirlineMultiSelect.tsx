import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Airline } from '@/types';
import { POPULAR_AIRLINE_CODES } from '@/store/appStore';
import { Search, X, Check } from 'lucide-react';

interface AirlineMultiSelectProps {
  airlines: Airline[];
  selected: string[];
  onToggle: (code: string) => void;
  onSelectAllPopular: () => void;
  onClear: () => void;
  className?: string;
}

export function AirlineMultiSelect({
  airlines,
  selected,
  onToggle,
  onSelectAllPopular,
  onClear,
  className,
}: AirlineMultiSelectProps) {
  const [search, setSearch] = useState('');

  const filteredAirlines = useMemo(() => {
    const query = search.toLowerCase();
    return airlines.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query)
    );
  }, [airlines, search]);

  const popularAirlines = useMemo(
    () => airlines.filter((a) => POPULAR_AIRLINE_CODES.includes(a.code)),
    [airlines]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search airline..."
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-3',
            'text-foreground placeholder:text-muted-foreground/50',
            'input-focus transition-all'
          )}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular shortcuts */}
      {!search && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Popular airlines</span>
            <button
              onClick={onSelectAllPopular}
              className="text-xs text-accent hover:underline"
            >
              Select all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularAirlines.map((airline) => {
              const isSelected = selected.includes(airline.code);
              return (
                <button
                  key={airline.code}
                  onClick={() => onToggle(airline.code)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    'border border-white/10',
                    isSelected
                      ? 'bg-accent text-background border-accent'
                      : 'bg-white/5 text-foreground hover:bg-white/10'
                  )}
                >
                  {airline.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All airlines grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {search ? 'Search results' : 'All airlines'}
          </span>
          {selected.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear ({selected.length})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-hide">
          {filteredAirlines.map((airline) => {
            const isSelected = selected.includes(airline.code);
            return (
              <button
                key={airline.code}
                onClick={() => onToggle(airline.code)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1.5',
                  'border border-white/10',
                  isSelected
                    ? 'bg-accent/20 text-accent border-accent/50'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {airline.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
