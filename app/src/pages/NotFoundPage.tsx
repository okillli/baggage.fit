import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import { useSEO } from '@/lib/useSEO';
import { ArrowRight } from 'lucide-react';

export function NotFoundPage() {
  useSEO({
    title: '404 — Page Not Found | baggage.fit',
    noIndex: true,
  });

  return (
    <PageLayout>
      <div className="text-center py-20">
        <h1 className="text-h2 font-heading font-bold mb-4">404 — Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-heading font-bold rounded-lg hover:brightness-110 transition-all btn-lift"
          >
            Check your bag
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/airlines"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground font-heading font-bold rounded-lg hover:border-accent/30 transition-all"
          >
            Browse airlines
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
