import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { airlineToSlug } from '@/lib/slugs';
import { formatDimensions } from '@/lib/fitLogic';
import { useSEO } from '@/lib/useSEO';
import { siteConfig } from '@/lib/siteConfig';
import { countryToFlag, CURRENT_YEAR } from '@/lib/format';
import { regions } from '@/lib/regions';
import { PageLayout } from '@/components/PageLayout';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Airline } from '@/types';

export function AirlinesListPage() {
  const { airlines, airlinesLoading, airlinesError, loadAirlines } = useAppStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  useSEO({
    title: `All Airline Baggage Limits ${CURRENT_YEAR} | baggage.fit`,
    description: 'Compare cabin, underseat, and checked baggage size and weight limits for all major airlines. Free bag size checker.',
    canonical: `${siteConfig.url}/airlines`,
  });

  const filteredAirlines = useMemo(() => {
    if (!search) return airlines;
    const q = search.toLowerCase();
    return airlines.filter(
      (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }, [airlines, search]);

  const grouped = useMemo(() => {
    return regions.map((region) => ({
      ...region,
      airlines: filteredAirlines.filter((a) => region.countries.includes(a.country)),
    })).filter((g) => g.airlines.length > 0);
  }, [filteredAirlines]);

  if (airlinesLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20" role="status" aria-label="Loading airlines">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (airlinesError) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-6">{airlinesError}</p>
          <button
            onClick={() => loadAirlines()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-heading font-bold rounded-lg hover:brightness-110 transition-all"
          >
            Try again
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `All Airline Baggage Limits ${CURRENT_YEAR}`,
            url: `${siteConfig.url}/airlines`,
            numberOfItems: airlines.length,
            itemListElement: airlines.slice(0, 50).map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a.name,
              url: `${siteConfig.url}/airlines/${airlineToSlug(a.name)}`,
            })),
          }),
        }}
      />

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
          aria-label="Search airlines"
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground/50 input-focus"
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
  const flag = countryToFlag(airline.country);
  const cabin = airline.allowances.cabin;

  return (
    <Link
      to={`/airlines/${slug}`}
      className={cn(
        'group bg-secondary border border-border rounded-xl p-4',
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

      <span className="inline-flex items-center gap-1 text-xs text-accent-on-light group-hover:underline">
        View details
        <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}
