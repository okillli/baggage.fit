import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CURRENT_YEAR } from '@/lib/format';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Header */}
      <header className="sticky top-0 z-overlay bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to checker
          </Link>
          <Link to="/" className="font-heading font-bold text-lg text-accent">
            baggage.fit
          </Link>
        </div>
      </header>

      {/* Content */}
      <main id="main-content" className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-muted-foreground/60">
          <p>Sizes are published limits; enforcement varies by route and staff.</p>
          <p className="mt-1">
            &copy; {CURRENT_YEAR} baggage.fit
          </p>
        </div>
      </footer>
    </div>
  );
}
