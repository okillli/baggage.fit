import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { useSEO } from '@/lib/useSEO';
import { siteConfig } from '@/lib/siteConfig';
import { CURRENT_YEAR } from '@/lib/format';
import { ArrowRight } from 'lucide-react';

export function AboutPage() {
  useSEO({
    title: `About | ${siteConfig.name}`,
    description: `${siteConfig.name} helps travelers check if their bag meets airline size and weight limits before they fly.`,
    canonical: `${siteConfig.url}/about`,
  });

  return (
    <PageLayout>
      <div className="max-w-2xl">
        <h1 className="text-h2 font-heading font-bold mb-6">About {siteConfig.name}</h1>

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            {siteConfig.name} is a free tool that helps travelers check whether their luggage
            meets airline size and weight limits — before they get to the gate.
          </p>
          <p>
            Enter your bag dimensions and weight, pick a bag type, and instantly see which
            airlines your bag fits. No sign-up, no ads, no nonsense.
          </p>
          <p>
            We currently cover 40+ airlines across Europe, the Americas, Asia Pacific,
            and the Middle East &amp; Africa. Data is sourced directly from official airline
            baggage policy pages and verified regularly.
          </p>
          <p>
            Built for travelers, by travelers. &copy; {CURRENT_YEAR}
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
            to="/data-sources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground font-heading font-bold rounded-lg hover:border-accent/30 transition-colors"
          >
            Data sources
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
