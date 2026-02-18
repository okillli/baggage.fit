import { useState, useRef, useEffect, useMemo, useCallback, useId } from 'react';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';
import { countryToFlag } from '@/lib/format';
import { formatDimensions } from '@/lib/fitLogic';
import { airlineToSlug } from '@/lib/slugs';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import type { Airline } from '@/types';

interface AirlineSearchProps {
  airlines: Airline[];
  onSelect?: (airline: Airline) => void;
  placeholder?: string;
  size?: 'default' | 'large';
  autoFocus?: boolean;
  className?: string;
}

export function AirlineSearch({
  airlines,
  onSelect,
  placeholder = 'Search airline (e.g. "Ryanair")',
  size = 'default',
  autoFocus = false,
  className,
}: AirlineSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const instanceId = useId();
  const listId = `${instanceId}-list`;
  const instructionsId = `${instanceId}-instructions`;

  const fuse = useMemo(
    () =>
      new Fuse(airlines, {
        keys: ['name', 'code', 'country'],
        threshold: 0.35,
        distance: 100,
      }),
    [airlines]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [fuse, query]);

  const handleSelect = useCallback(
    (airline: Airline) => {
      setQuery('');
      setIsOpen(false);
      if (onSelect) {
        onSelect(airline);
      } else {
        navigate(`/airlines/${airlineToSlug(airline.name)}`);
      }
    },
    [onSelect, navigate]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) handleSelect(results[activeIndex]);
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, activeIndex, handleSelect]
  );

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset active index when results change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveIndex(0); }, [results]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement | undefined;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={cn('relative z-10', className)}>
      <p id={instructionsId} className="sr-only">
        Type to search. Use arrow keys to navigate, Enter to select, Escape to close.
      </p>
      <div className="relative">
        <Search
          aria-hidden="true"
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
            isLarge ? 'w-5 h-5 left-4' : 'w-4 h-4'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-controls={listId}
          aria-activedescendant={isOpen && results.length > 0 ? `${instanceId}-option-${activeIndex}` : undefined}
          aria-label="Search airlines"
          aria-describedby={instructionsId}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-foreground/10 border border-foreground/20 text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all',
            isLarge ? 'pl-12 pr-10 py-4 text-lg' : 'pl-10 pr-10 py-2.5 text-sm'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors',
              isLarge && 'right-4'
            )}
            aria-label="Clear search"
          >
            <X className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-[360px] overflow-y-auto"
        >
          {results.map((airline, i) => {
            const cabinDims = airline.allowances.cabin?.maxCm;
            return (
              <li
                key={airline.code}
                id={`${instanceId}-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(airline)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                  i === activeIndex ? 'bg-accent/10' : 'hover:bg-secondary'
                )}
              >
                <span className="text-xl shrink-0" aria-hidden="true">{countryToFlag(airline.country)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{airline.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {airline.code}
                    {cabinDims && (
                      <span className="ml-2">
                        Cabin: {formatDimensions(cabinDims, 'cm')}
                      </span>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* No results */}
      {isOpen && query.trim().length > 1 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-lg p-4 text-center text-sm text-muted-foreground">
          No airlines found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
