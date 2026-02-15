import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { useSEO } from '@/lib/useSEO';
import { siteConfig } from '@/lib/siteConfig';
import { ArrowRight } from 'lucide-react';

export function DataSourcesPage() {
  useSEO({
    title: `Data Sources | ${siteConfig.name}`,
    description: 'How we collect and verify airline baggage size and weight limits.',
    canonical: `${siteConfig.url}/data-sources`,
  });

  return (
    <PageLayout>
      <div className="max-w-2xl">
        <h1 className="text-h2 font-heading font-bold mb-6">Data Sources</h1>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All baggage size and weight limits on {siteConfig.name} are sourced directly
            from each airline&apos;s official baggage policy page.
          </p>

          <h2 className="text-h3 font-heading font-bold text-foreground pt-4">How we collect data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We visit each airline&apos;s official website and locate their baggage policy page.</li>
            <li>We record the published maximum dimensions (L &times; W &times; H) and weight limits for cabin, underseat, and checked bags.</li>
            <li>Where airlines publish a total linear dimension limit (e.g. 158 cm), we record that format.</li>
          </ul>

          <h2 className="text-h3 font-heading font-bold text-foreground pt-4">Verification</h2>
          <p>
            Each airline&apos;s data includes a &quot;Last verified&quot; date showing when we
            last confirmed the information against the airline&apos;s website. We aim to
            re-verify all airlines at least quarterly.
          </p>

          <h2 className="text-h3 font-heading font-bold text-foreground pt-4">Important notes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Airline rules change frequently and may vary by route, fare class, and loyalty status.</li>
            <li>Enforcement varies — some airlines are strict, others are lenient.</li>
            <li>Always confirm on the airline&apos;s official page before you fly.</li>
          </ul>
          <p>
            Each airline detail page includes a direct link to the official policy.
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-heading font-bold rounded-lg hover:brightness-110 transition-colors btn-lift"
          >
            Check your bag
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <Link
            to="/airlines"
            className="inline-flex items-center gap-2 text-accent-on-light hover:underline"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            Browse all airlines
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
