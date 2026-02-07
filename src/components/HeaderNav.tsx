import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { Plane, Scale, List } from 'lucide-react';

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentView, setCurrentView } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'check', label: 'Check', icon: Plane },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'airline', label: 'Airlines', icon: List },
  ] as const;

  const handleNavClick = (id: typeof navItems[number]['id']) => {
    setCurrentView(id);
    switch (id) {
      case 'check':
        scrollToPinCenter('bag-type');
        break;
      case 'airline':
        scrollToPinCenter('airline-selector');
        break;
      case 'compare':
        gsap.to(window, { scrollTo: '#compare', duration: 0.8, ease: 'power2.inOut' });
        break;
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        {/* Logo */}
        <button
          onClick={() => {
            setCurrentView('hero');
            scrollToPinCenter('hero');
          }}
          className="font-heading font-bold text-xl tracking-tight text-foreground hover:text-accent transition-colors"
        >
          baggage.fit
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                  isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Nav */}
        <nav className="md:hidden flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
