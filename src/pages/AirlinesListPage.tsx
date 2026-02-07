import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { airlineToSlug } from '@/lib/slugs';
import { formatDimensions } from '@/lib/fitLogic';
import { useSEO } from '@/lib/useSEO';
import { PageLayout } from '@/components/PageLayout';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Airline } from '@/types';

const regionConfig: { key: string; label: string; countries: string[] }[] = [
  { key: 'europe', label: 'Europe', countries: ['IE', 'GB', 'DE', 'NL', 'FR', 'ES', 'PT', 'AT', 'SE', 'FI', 'PL', 'NO', 'IS', 'HU', 'CZ', 'BE'] },
  { key: 'americas', label: 'Americas', countries: ['US', 'CA'] },
  { key: 'asia', label: 'Asia Pacific', countries: ['JP', 'SG', 'HK', 'KR', 'TH', 'MY', 'PH', 'ID', 'CN', 'NZ', 'AU'] },
  { key: 'middle_east', label: 'Middle East & Africa', countries: ['AE', 'QA', 'TR'] },
];

export function AirlinesListPage() {
  const { airlines, airlinesLoading, loadAirlines } = useAppStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  useSEO({
    title: `All Airline Baggage Limits ${new Date().getFullYear()} | baggage.fit`,
    description: 'Compare cabin, underseat, and checked baggage size and weight limits for all major airlines. Free bag size checker.',
    canonical: 'https://baggage.fit/airlines',
  });

  const filteredAirlines = useMemo(() => {
    if (!search) return airlines;
    const q = search.toLowerCase();
    return airlines.filter(
      (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }, [airlines, search]);

  const grouped = useMemo(() => {
    return regionConfig.map((region) => ({
      ...region,
      airlines: filteredAirlines.filter((a) => region.countries.includes(a.country)),
    })).filter((g) => g.airlines.length > 0);
  }, [filteredAirlines]);

  if (airlinesLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-10">
        <h1 className="text-h2 font-heading font-bold mb-4">ALL AIRLINES</h1>
        <p className="text-muted-foreground max-w-xl">
          Browse baggage size and weight limits for {airlines.length} airlines. Click any airline for full details.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search airlines..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground/50 input-focus"
        />
      </div>

      {/* Grouped airlines */}
      <div className="space-y-10">
        {grouped.map((group) => (
          <div key={group.key}>
            <h2 className="section-label mb-4">{group.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.airlines.map((airline) => (
                <AirlineCard key={airline.code} airline={airline} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredAirlines.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No airlines found matching &quot;{search}&quot;.
        </p>
      )}
    </PageLayout>
  );
}

function AirlineCard({ airline }: { airline: Airline }) {
  const slug = airlineToSlug(airline.name);
  const flag = String.fromCodePoint(
    ...airline.country.toUpperCase().split('').map((c) => c.charCodeAt(0) + 0x1F1A5)
  );
  const cabin = airline.allowances.cabin;

  return (
    <Link
      to={`/airlines/${slug}`}
      className={cn(
        'group bg-white/5 border border-white/10 rounded-xl p-4',
        'hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{flag}</span>
        <div className="min-w-0">
          <p className="font-heading font-bold text-sm truncate">{airline.name}</p>
          <p className="text-xs font-mono text-muted-foreground">{airline.code}</p>
        </div>
      </div>

      {cabin?.maxCm && (
        <p className="text-xs font-mono text-muted-foreground mb-2">
          Cabin: {formatDimensions(cabin.maxCm, 'cm')}
          {cabin.maxKg ? `, ${cabin.maxKg} kg` : ''}
        </p>
      )}

      <span className="inline-flex items-center gap-1 text-xs text-accent group-hover:underline">
        View details
        <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}
