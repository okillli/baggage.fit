import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { findAirlineBySlug } from '@/lib/slugs';
import { useSEO } from '@/lib/useSEO';
import { formatDimensions, convertWeightToKg } from '@/lib/fitLogic';
import { CURRENT_YEAR } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';
import { safeJsonLd } from '@/lib/utils';
import { PageLayout } from '@/components/PageLayout';
import { AirlineDetailContent } from '@/components/AirlineDetailContent';
import { AirlineSearch } from '@/components/AirlineSearch';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function AirlinePage() {
  const { slug } = useParams<{ slug: string }>();
  const { airlines, airlinesLoading, airlinesError, loadAirlines, dimensions, unit, weight, weightUnit, bagType } = useAppStore();
  const userWeightKg = weight != null && weight > 0
    ? convertWeightToKg(weight, weightUnit)
    : undefined;

  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  const airline = slug ? findAirlineBySlug(airlines, slug) : undefined;

  // SEO
  const title = airline
    ? `${airline.name} Baggage Size & Weight Limits ${CURRENT_YEAR} | baggage.fit`
    : 'Airline Baggage Limits | baggage.fit';

  const cabinDims = airline?.allowances.cabin?.maxCm;
  const cabinKg = airline?.allowances.cabin?.maxKg;
  const description = airline
    ? `Check ${airline.name} cabin (${formatDimensions(cabinDims ?? null, 'cm')}${cabinKg ? `, ${cabinKg}kg` : ''}), underseat, and checked baggage limits. Free size checker.`
    : '';

  useSEO({
    title,
    description,
    canonical: airline ? `${siteConfig.url}/airlines/${slug}` : undefined,
    ogTitle: airline ? `${airline.name} Baggage Limits ${CURRENT_YEAR}` : undefined,
    ogUrl: airline ? `${siteConfig.url}/airlines/${slug}` : undefined,
  });

  if (airlinesLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-20" role="status" aria-label="Loading airline details">
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
            className="inline-flex items-center gap-2 text-accent-on-light hover:underline"
          >
            Browse all airlines
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description,
            url: `${siteConfig.url}/airlines/${slug}`,
            dateModified: airline.lastVerified,
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url,
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
                { '@type': 'ListItem', position: 2, name: 'Airlines', item: `${siteConfig.url}/airlines` },
                { '@type': 'ListItem', position: 3, name: airline.name, item: `${siteConfig.url}/airlines/${slug}` },
              ],
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-8">
        <ol className="flex items-center">
          <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li aria-hidden="true" className="mx-2">/</li>
          <li><Link to="/airlines" className="hover:text-foreground transition-colors">Airlines</Link></li>
          <li aria-hidden="true" className="mx-2">/</li>
          <li aria-current="page" className="text-foreground">{airline.name}</li>
        </ol>
      </nav>

      <AirlineDetailContent
        airline={airline}
        userDimensions={dimensions}
        activeBagType={bagType}
        unit={unit}
        weightUnit={weightUnit}
        userWeightKg={userWeightKg}
        headingLevel="h1"
        showFitChecker
        className="max-w-4xl"
      />

      {/* Compare with another airline */}
      <div className="mt-10 max-w-4xl space-y-4">
        <h2 className="section-label">Compare with another airline</h2>
        <AirlineSearch airlines={airlines} placeholder="Search another airline..." />
        <Link
          to="/airlines"
          className="inline-flex items-center gap-2 text-sm text-accent-on-light hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to all airlines
        </Link>
      </div>
    </PageLayout>
  );
}
