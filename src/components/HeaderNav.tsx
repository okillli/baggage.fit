import { useState, useEffect } from 'react';
import { cn, scrollToPinCenter, gsapScrollTo } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/lib/useTheme';
import { Plane, List, Sun, Moon } from 'lucide-react';

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentView, checkPanelOpen, setCurrentView, setCheckPanelOpen } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'check', label: 'Check', icon: Plane },
    { id: 'browse', label: 'Airlines', icon: List },
  ] as const;

  const handleNavClick = (id: typeof navItems[number]['id']) => {
    switch (id) {
      case 'check':
        setCheckPanelOpen(true);
        setCurrentView('browse');
        scrollToPinCenter('bag-type');
        break;
      case 'browse':
        setCheckPanelOpen(false);
        setCurrentView('browse');
        gsapScrollTo('#airlines');
        break;
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-nav transition-all duration-300',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        {/* Logo */}
        <button
          onClick={() => {
            setCurrentView('hero');
            gsapScrollTo(0);
          }}
          className="font-heading font-bold text-xl tracking-tight text-foreground hover:text-accent transition-colors"
        >
          baggage.fit
        </button>

        <div className="flex items-center gap-1">
          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'check'
                ? checkPanelOpen && currentView === 'browse'
                : item.id === 'browse' ? currentView === 'browse' && !checkPanelOpen : false;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Nav */}
          <nav aria-label="Main navigation mobile" className="md:hidden flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'check'
                ? checkPanelOpen && currentView === 'browse'
                : item.id === 'browse' ? currentView === 'browse' && !checkPanelOpen : false;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-md text-xs font-medium transition-colors',
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-11 h-11 min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-1"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
