import { useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { CompareTable } from '@/components/CompareTable';
import { ScrollReveal } from '@/components/ScrollReveal';
import type { BagType, SortOption } from '@/types';
import { ArrowUpDown, Ruler, Backpack, Package, Globe } from 'lucide-react';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

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

export function CompareMode() {
  const sectionRef = useRef<HTMLElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [regionFilter, setRegionFilter] = useState('all');

  const {
    airlines,
    airlinesLoading,
    loadAirlines,
    compareBagType,
    compareSort,
    setCompareBagType,
    setCompareSort,
    unit,
  } = useAppStore();

  // Load airlines data from centralized store
  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  // Filter airlines by region
  const filteredAirlines = useMemo(() => {
    if (regionFilter === 'all') return airlines;
    const regionCountries = regionMap[regionFilter] || [];
    return airlines.filter((airline) => regionCountries.includes(airline.country));
  }, [airlines, regionFilter]);

  // Flowing section animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const controls = controlsRef.current;
    if (!section || !controls) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(controls,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [airlinesLoading]);

  if (airlinesLoading) {
    return (
      <section
        ref={sectionRef}
        id="compare"
        className="section-flowing py-20 bg-[#F2F2F2] text-background"
      >
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
    <section
      ref={sectionRef}
      id="compare"
      className="section-flowing py-20 bg-[#F2F2F2] text-background grid-lines"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-background/60 block mb-4">
                COMPARE
              </span>
              <h2 className="text-h2 font-heading font-bold text-background">
                COMPARE AIRLINES
              </h2>
              <p className="text-background/70 mt-2">
                Rank by the most generous allowance for your bag type.
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

        {/* Filters */}
        <ScrollReveal delay={0.1} className="mb-8">
          <div ref={controlsRef} className="flex flex-col lg:flex-row gap-4">
            {/* Bag Type Toggle */}
            <div className="flex flex-wrap gap-2">
              {bagTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = compareBagType === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setCompareBagType(opt.type)}
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
            bagType={compareBagType}
            sort={compareSort}
            unit={unit}
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
