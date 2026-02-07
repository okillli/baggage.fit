import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { findAirlineBySlug } from '@/lib/slugs';
import { useSEO } from '@/lib/useSEO';
import { formatDimensions } from '@/lib/fitLogic';
import { PageLayout } from '@/components/PageLayout';
import { AirlineDetailContent } from '@/components/AirlineDetailContent';
import { ArrowRight } from 'lucide-react';

export function AirlinePage() {
  const { slug } = useParams<{ slug: string }>();
  const { airlines, airlinesLoading, loadAirlines, dimensions, unit, weight, weightUnit, bagType } = useAppStore();
  const userWeightKg = weight != null && weight > 0
    ? (weightUnit === 'lb' ? Math.round(weight * 0.453592 * 100) / 100 : weight)
    : undefined;

  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  const airline = slug ? findAirlineBySlug(airlines, slug) : undefined;

  // SEO
  const title = airline
    ? `${airline.name} Baggage Size & Weight Limits ${new Date().getFullYear()} | baggage.fit`
    : 'Airline Baggage Limits | baggage.fit';

  const cabinDims = airline?.allowances.cabin?.maxCm;
  const cabinKg = airline?.allowances.cabin?.maxKg;
  const description = airline
    ? `Check ${airline.name} cabin (${formatDimensions(cabinDims ?? null, 'cm')}${cabinKg ? `, ${cabinKg}kg` : ''}), underseat, and checked baggage limits. Free size checker.`
    : '';

  useSEO({
    title,
    description,
    canonical: airline ? `https://baggage.fit/airlines/${slug}` : undefined,
    ogTitle: airline ? `${airline.name} Baggage Limits ${new Date().getFullYear()}` : undefined,
    ogUrl: airline ? `https://baggage.fit/airlines/${slug}` : undefined,
  });

  if (airlinesLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!airline) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h1 className="text-h3 font-heading font-bold mb-4">Airline Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find an airline matching &quot;{slug}&quot;.
          </p>
          <Link
            to="/airlines"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            Browse all airlines
            <ArrowRight className="w-4 h-4" />
          </Link>
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
            '@type': 'WebPage',
            name: title,
            description,
            url: `https://baggage.fit/airlines/${slug}`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://baggage.fit' },
                { '@type': 'ListItem', position: 2, name: 'Airlines', item: 'https://baggage.fit/airlines' },
                { '@type': 'ListItem', position: 3, name: airline.name },
              ],
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/airlines" className="hover:text-foreground transition-colors">Airlines</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{airline.name}</span>
      </nav>

      <AirlineDetailContent
        airline={airline}
        userDimensions={dimensions}
        activeBagType={bagType}
        unit={unit}
        weightUnit={weightUnit}
        userWeightKg={userWeightKg}
        className="max-w-4xl"
      />

      {/* CTA */}
      <div className="mt-10 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-heading font-bold rounded-lg hover:brightness-110 transition-all btn-lift"
        >
          Check your bag against {airline.name}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </PageLayout>
  );
}
