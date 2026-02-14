import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { CompareTable } from '@/components/CompareTable';
import { CheckYourBagPanel } from '@/components/CheckYourBagPanel';
import { ScrollReveal } from '@/components/ScrollReveal';
import { regions, regionMap } from '@/lib/regions';
import type { BagType, FitFilter, FitResult, SortOption } from '@/types';
import { convertWeightToKg } from '@/lib/fitLogic';
import { ArrowUpDown, Ruler, Backpack, Package, Globe, Check, X } from 'lucide-react';

const bagTypeOptions: { type: BagType; label: string; icon: typeof Ruler }[] = [
  { type: 'cabin', label: 'Cabin', icon: Ruler },
  { type: 'underseat', label: 'Underseat', icon: Backpack },
  { type: 'checked', label: 'Checked', icon: Package },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'largest', label: 'Largest allowance' },
  { value: 'strictest', label: 'Strictest' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

const regionOptions = [
  { value: 'all', label: 'All Regions' },
  ...regions.map(r => ({ value: r.key, label: r.label })),
];

export function AirlinesBrowse() {
  const [regionFilter, setRegionFilter] = useState('all');
  const [fitFilter, setFitFilter] = useState<FitFilter>('all');

  const {
    airlines,
    airlinesLoading,
    airlinesError,
    loadAirlines,
    bagType,
    setBagType,
    compareSort,
    setCompareSort,
    unit,
    weight,
    weightUnit,
    results,
    setSelectedAirlineDetail,
  } = useAppStore();

  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  // Build fit map for filtering
  const fitMap = useMemo(() => {
    if (results.length === 0) return null;
    const map = new Map<string, FitResult>();
    for (const r of results) {
      map.set(r.airline.code, r);
    }
    return map;
  }, [results]);

  // Region-filtered airlines (before fit filter)
  const regionFiltered = useMemo(() => {
    if (regionFilter === 'all') return airlines;
    const regionCountries = regionMap[regionFilter] || [];
    return airlines.filter((airline) => regionCountries.includes(airline.country));
  }, [airlines, regionFilter]);

  // Fit counts from region-filtered airlines only
  const fitCounts = useMemo(() => {
    if (!fitMap) return { all: 0, fits: 0, doesntFit: 0 };
    let all = 0, fits = 0, doesntFit = 0;
    for (const airline of regionFiltered) {
      const fit = fitMap.get(airline.code);
      if (fit) {
        all++;
        if (fit.outcome === 'fits') fits++;
        else if (fit.outcome === 'doesnt-fit') doesntFit++;
      }
    }
    return { all, fits, doesntFit };
  }, [regionFiltered, fitMap]);

  // Apply fit filter on region-filtered airlines
  const filteredAirlines = useMemo(() => {
    if (fitFilter === 'all' || !fitMap) return regionFiltered;
    return regionFiltered.filter((airline) => {
      const fit = fitMap.get(airline.code);
      if (!fit) return false;
      return fitFilter === 'fits' ? fit.outcome === 'fits' : fit.outcome === 'doesnt-fit';
    });
  }, [regionFiltered, fitFilter, fitMap]);

  const hasResults = results.length > 0;

  const userWeightKg = weight != null && weight > 0 ? convertWeightToKg(weight, weightUnit) : null;

  if (airlinesLoading) {
    return (
      <section id="airlines" className="section-flowing py-20 section-surface bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading airlines">
            <div className="w-8 h-8 border-4 border-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-foreground/60">Loading airlines...</span>
          </div>
        </div>
      </section>
    );
  }

  if (airlinesError) {
    return (
      <section id="airlines" className="section-flowing py-20 section-surface bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-foreground/70">{airlinesError}</p>
            <button
              onClick={() => loadAirlines()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-foreground font-heading font-bold rounded-lg hover:brightness-110 transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="airlines" className="section-flowing py-20 section-surface bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-foreground/60 block mb-4">
                AIRLINE LIMITS
              </span>
              <h2 className="text-h2 font-heading font-bold text-foreground">
                BROWSE AIRLINES
              </h2>
              <p className="text-foreground/70 mt-2">
                See every airline&apos;s size and weight limits at a glance.
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-foreground/60" />
              <select
                value={compareSort}
                onChange={(e) => setCompareSort(e.target.value as SortOption)}
                aria-label="Sort airlines by"
                className="bg-white border border-foreground/20 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Check your bag panel */}
        <ScrollReveal className="mb-8">
          <CheckYourBagPanel airlines={airlines} />
        </ScrollReveal>

        {/* Fit summary + filter chips (only when results exist) */}
        {hasResults && (
          <ScrollReveal delay={0.05} className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground/70">Filter:</span>
              <button
                onClick={() => setFitFilter('all')}
                aria-pressed={fitFilter === 'all'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-sm font-medium transition-all',
                  fitFilter === 'all'
                    ? 'bg-foreground text-white'
                    : 'bg-white border border-foreground/20 text-foreground/70 hover:bg-foreground/5'
                )}
              >
                All ({fitCounts.all})
              </button>
              <button
                onClick={() => setFitFilter('fits')}
                aria-pressed={fitFilter === 'fits'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-sm font-medium transition-all',
                  fitFilter === 'fits'
                    ? 'bg-accent text-foreground'
                    : 'bg-white border border-foreground/20 text-foreground/70 hover:bg-foreground/5'
                )}
              >
                <Check className="w-3.5 h-3.5" />
                Fits ({fitCounts.fits})
              </button>
              <button
                onClick={() => setFitFilter('doesnt-fit')}
                aria-pressed={fitFilter === 'doesnt-fit'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-sm font-medium transition-all',
                  fitFilter === 'doesnt-fit'
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-foreground/20 text-foreground/70 hover:bg-foreground/5'
                )}
              >
                <X className="w-3.5 h-3.5" />
                Doesn&apos;t fit ({fitCounts.doesntFit})
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* Filters: bag type + region */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Bag Type Toggle */}
            <div className="flex flex-wrap gap-2">
              {bagTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = bagType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setBagType(opt.type)}
                    aria-pressed={isActive}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'bg-white border border-foreground/20 text-foreground/70 hover:bg-foreground/5'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-foreground/60" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                aria-label="Filter by region"
                className="bg-white border border-foreground/20 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {regionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Results count */}
        <ScrollReveal delay={0.15} className="mb-4">
          <p className="text-sm text-foreground/60" aria-live="polite">
            Showing {filteredAirlines.length} airline{filteredAirlines.length !== 1 ? 's' : ''}
            {regionFilter !== 'all' && ` in ${regionOptions.find(r => r.value === regionFilter)?.label}`}
            {hasResults && fitFilter !== 'all' && ` (${fitFilter === 'fits' ? 'fits' : "doesn't fit"})`}
          </p>
        </ScrollReveal>

        {/* Table */}
        <ScrollReveal delay={0.2}>
          <CompareTable
            airlines={filteredAirlines}
            bagType={bagType}
            sort={compareSort}
            unit={unit}
            weightUnit={weightUnit}
            userWeightKg={userWeightKg}
            fitResults={hasResults ? results : undefined}
            onAirlineClick={(code) => setSelectedAirlineDetail(code)}
          />
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal delay={0.3} className="mt-10">
          <p className="text-sm text-foreground/50 text-center">
            Sizes are published limits; enforcement varies by route and staff.
            Always confirm on the airline&apos;s official page before you fly.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
