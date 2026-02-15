import { useState, useEffect } from 'react';
import { cn, gsapScrollTo } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/lib/useTheme';
import { AirlineSearch } from '@/components/AirlineSearch';
import { Search, Sun, Moon, List } from 'lucide-react';

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { airlines, setCurrentView } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-nav transition-all duration-300',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <nav aria-label="Main navigation" className="flex items-center justify-between px-6 lg:px-10 py-3">
        {/* Logo */}
        <button
          onClick={() => {
            setCurrentView('hero');
            gsapScrollTo(0);
          }}
          aria-label="baggage.fit — scroll to top"
          className="font-heading font-bold text-xl tracking-tight text-foreground hover:text-accent transition-colors shrink-0"
        >
          baggage.fit
        </button>

        {/* Inline search (visible on scroll) */}
        {isScrolled && (
          <div className="hidden md:block flex-1 max-w-sm mx-6">
            <AirlineSearch
              airlines={airlines}
              placeholder="Search airline..."
              size="default"
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden flex items-center justify-center w-11 h-11 min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Browse link */}
          <button
            onClick={() => {
              setCurrentView('browse');
              gsapScrollTo('#airlines');
            }}
            aria-label="Browse airlines"
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <List className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Airlines</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-11 h-11 min-h-[44px] rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile search dropdown */}
      {showSearch && (
        <div className="md:hidden px-6 pb-3">
          <AirlineSearch
            airlines={airlines}
            placeholder="Search airline..."
            size="default"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
