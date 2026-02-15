import { Link } from 'react-router-dom';
import { cn, gsapScrollTo } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CURRENT_YEAR } from '@/lib/format';
import { siteConfig } from '@/lib/siteConfig';
import { Plane, Mail } from 'lucide-react';

export function Footer() {
  const { setCurrentView, setCheckPanelOpen, resetInputs } = useAppStore();

  const handleCheckAnother = () => {
    resetInputs();
    setCheckPanelOpen(true);
    setCurrentView('browse');
    gsapScrollTo('#airlines');
  };

  return (
    <footer className="section-flowing py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <ScrollReveal>
          {/* Logo */}
          <p className="font-heading font-bold text-h3 mb-6">{siteConfig.name}</p>

          {/* Disclaimer */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Airline rules change and vary by route, fare, and enforcement.
            Always confirm on the airline&apos;s official page before you fly.
          </p>

          {/* CTA */}
          <button
            onClick={handleCheckAnother}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 mb-10',
              'bg-accent text-accent-foreground font-heading font-bold text-lg rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift'
            )}
          >
            <Plane className="w-5 h-5" aria-hidden="true" />
            Check another bag
          </button>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href={siteConfig.social.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (opens in new tab)"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              X
            </a>
            <span className="text-muted-foreground/30">·</span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (opens in new tab)"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Instagram
            </a>
            <span className="text-muted-foreground/30">·</span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              Contact
            </a>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 mb-4 text-xs">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <span className="text-muted-foreground/30">·</span>
            <Link to="/data-sources" className="text-muted-foreground hover:text-foreground transition-colors">Data Sources</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            &copy; {CURRENT_YEAR} {siteConfig.name} &mdash; Built for travelers
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
