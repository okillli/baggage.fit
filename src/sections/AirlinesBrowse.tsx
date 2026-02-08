import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { CompareTable } from '@/components/CompareTable';
import { CheckYourBagPanel } from '@/components/CheckYourBagPanel';
import { ScrollReveal } from '@/components/ScrollReveal';
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
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia Pacific' },
  { value: 'americas', label: 'Americas' },
  { value: 'middle_east', label: 'Middle East' },
];

const regionMap: Record<string, string[]> = {
  europe: ['IE', 'GB', 'DE', 'NL', 'FR', 'ES', 'PT', 'AT', 'SE', 'FI', 'PL', 'NO', 'IS', 'HU', 'CZ', 'BE'],
  asia: ['JP', 'SG', 'HK', 'KR', 'TH', 'MY', 'PH', 'ID', 'CN', 'NZ', 'AU'],
  americas: ['US', 'CA'],
  middle_east: ['AE', 'QA', 'TR'],
};

export function AirlinesBrowse() {
  const [regionFilter, setRegionFilter] = useState('all');
  const [fitFilter, setFitFilter] = useState<FitFilter>('all');

  const {
    airlines,
    airlinesLoading,
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

  // Filter airlines by region, then by fit
  const filteredAirlines = useMemo(() => {
    let filtered = airlines;

    // Region filter
    if (regionFilter !== 'all') {
      const regionCountries = regionMap[regionFilter] || [];
      filtered = filtered.filter((airline) => regionCountries.includes(airline.country));
    }

    // Fit filter (only when results exist)
    if (fitFilter !== 'all' && fitMap) {
      filtered = filtered.filter((airline) => {
        const fit = fitMap.get(airline.code);
        if (!fit) return false;
        return fitFilter === 'fits' ? fit.outcome === 'fits' : fit.outcome === 'doesnt-fit';
      });
    }

    return filtered;
  }, [airlines, regionFilter, fitFilter, fitMap]);

  const fitsCount = results.filter((r) => r.outcome === 'fits').length;
  const doesntFitCount = results.filter((r) => r.outcome === 'doesnt-fit').length;
  const hasResults = results.length > 0;

  const userWeightKg = weight != null && weight > 0 ? convertWeightToKg(weight, weightUnit) : null;

  if (airlinesLoading) {
    return (
      <section id="airlines" className="section-flowing py-20 bg-[#F2F2F2] text-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-background/30 border-t-background rounded-full animate-spin" />
            <span className="text-background/60">Loading airlines...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="airlines" className="section-flowing py-20 bg-[#F2F2F2] text-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-background/60 block mb-4">
                AIRLINE LIMITS
              </span>
              <h2 className="text-h2 font-heading font-bold text-background">
                BROWSE AIRLINES
              </h2>
              <p className="text-background/70 mt-2">
                See every airline&apos;s size and weight limits at a glance.
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-background/60" />
              <select
                value={compareSort}
                onChange={(e) => setCompareSort(e.target.value as SortOption)}
                className="bg-white border border-background/20 rounded-lg px-4 py-2 text-sm text-background focus:outline-none focus:ring-2 focus:ring-accent"
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
              <span className="text-sm font-medium text-background/70">Filter:</span>
              <button
                onClick={() => setFitFilter('all')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  fitFilter === 'all'
                    ? 'bg-background text-white'
                    : 'bg-white border border-background/20 text-background/70 hover:bg-background/5'
                )}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setFitFilter('fits')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  fitFilter === 'fits'
                    ? 'bg-accent text-background'
                    : 'bg-white border border-background/20 text-background/70 hover:bg-background/5'
                )}
              >
                <Check className="w-3.5 h-3.5" />
                Fits ({fitsCount})
              </button>
              <button
                onClick={() => setFitFilter('doesnt-fit')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  fitFilter === 'doesnt-fit'
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-background/20 text-background/70 hover:bg-background/5'
                )}
              >
                <X className="w-3.5 h-3.5" />
                Doesn&apos;t fit ({doesntFitCount})
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
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-accent text-background'
                        : 'bg-white border border-background/20 text-background/70 hover:bg-background/5'
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
              <Globe className="w-4 h-4 text-background/60" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-white border border-background/20 rounded-lg px-4 py-2 text-sm text-background focus:outline-none focus:ring-2 focus:ring-accent"
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
          <p className="text-sm text-background/60">
            Showing {filteredAirlines.length} airline{filteredAirlines.length !== 1 ? 's' : ''}
            {regionFilter !== 'all' && ` in ${regionOptions.find(r => r.value === regionFilter)?.label}`}
          </p>
        </ScrollReveal>

        {/* Table */}
        <ScrollReveal delay={0.2}>
          <CompareTable
            airlines={filteredAirlines}
            bagType={bagType}
            sort={compareSort}
            unit={unit}
            userWeightKg={userWeightKg}
            fitResults={hasResults ? results : undefined}
            onAirlineClick={(code) => setSelectedAirlineDetail(code)}
          />
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal delay={0.3} className="mt-10">
          <p className="text-sm text-background/50 text-center">
            Sizes are published limits; enforcement varies by route and staff.
            Always confirm on the airline&apos;s official page before you fly.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
