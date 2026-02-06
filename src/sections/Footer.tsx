import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Plane, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const { setCurrentView } = useAppStore();

  const handleCheckAnother = () => {
    setCurrentView('hero');
    scrollToPinCenter('hero');
  };

  return (
    <footer className="section-flowing py-20 z-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <ScrollReveal>
          {/* Logo */}
          <h2 className="font-heading font-bold text-3xl mb-6">baggage.fit</h2>

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
              'bg-accent text-background font-heading font-bold text-lg rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift'
            )}
          >
            <Plane className="w-5 h-5" />
            Check another bag
          </button>

          {/* Links */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Data sources
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} baggage.fit — Built for travelers
          </p>
        </ScrollReveal>
      </div>
    </footer>
  );
}
