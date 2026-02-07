import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { AirlineMultiSelect } from '@/components/AirlineMultiSelect';
import { Plane, Scale, Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function AirlineSelector() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const {
    airlines,
    airlinesLoading,
    loadAirlines,
    selectedAirlines,
    toggleAirline,
    selectAllPopularAirlines,
    clearSelectedAirlines,
    checkFit,
    setCurrentView,
  } = useAppStore();

  // Load airlines data from centralized store
  useEffect(() => {
    loadAirlines();
  }, [loadAirlines]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const header = headerRef.current!;
      const selector = selectorRef.current!;
      const cta = ctaRef.current!;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.3,
        },
      });

      // ENTRANCE (0% - 27%): Scale Bloom — header drops, selector blooms, CTAs rise
      scrollTl
        .fromTo(header,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          0
        )
        .fromTo(selector,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: 'power2.out' },
          0.06
        )
        .fromTo(cta,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
          0.15
        );

      // SETTLE (27% - 70%): Hold

      // EXIT (70% - 100%): Elements fly out
      scrollTl
        .fromTo(header,
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0, duration: 0.30, ease: 'power2.in' },
          0.70
        )
        .fromTo(selector,
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0, duration: 0.28, ease: 'power2.in' },
          0.72
        )
        .fromTo(cta,
          { y: 0, opacity: 1 },
          { y: 50, opacity: 0, duration: 0.25, ease: 'power2.in' },
          0.75
        );
    }, section);

    return () => ctx.revert();
  }, [airlinesLoading]);

  const handleCheckFit = () => {
    if (selectedAirlines.length === 0) return;
    checkFit(airlines);
    setCurrentView('check');
    gsap.to(window, { scrollTo: '#results', duration: 0.6, ease: 'power2.inOut' });
  };

  const handleCompare = () => {
    setCurrentView('compare');
    gsap.to(window, { scrollTo: '#compare', duration: 0.6, ease: 'power2.inOut' });
  };

  if (airlinesLoading) {
    return (
      <section
        ref={sectionRef}
        id="airline-selector"
        className="section-pinned flex items-center justify-center z-40"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <span className="text-muted-foreground">Loading airlines...</span>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="airline-selector"
      className="section-pinned flex flex-col items-center justify-center z-40"
    >
      <div ref={contentRef} className="w-full max-w-3xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <span className="section-label block mb-4">
            STEP 3 / AIRLINE
          </span>
          <h2 className="text-h2 font-heading font-bold">
            WHO ARE YOU FLYING?
          </h2>
        </div>

        {/* Search */}
        <div ref={selectorRef} className="origin-center">
          <AirlineMultiSelect
            airlines={airlines}
            selected={selectedAirlines}
            onToggle={toggleAirline}
            onSelectAllPopular={selectAllPopularAirlines}
            onClear={clearSelectedAirlines}
          />
        </div>

        {/* Selected count */}
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">
            {selectedAirlines.length} airline{selectedAirlines.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCheckFit}
            disabled={selectedAirlines.length === 0}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4',
              'bg-accent text-background font-heading font-bold text-lg rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100'
            )}
          >
            <Plane className="w-5 h-5" />
            Check fit
          </button>

          <button
            onClick={handleCompare}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-4',
              'bg-white/10 text-foreground font-medium rounded-lg',
              'hover:bg-white/20 transition-all duration-200 btn-lift',
              'border border-white/10'
            )}
          >
            <Scale className="w-5 h-5" />
            Compare all airlines
          </button>
        </div>
      </div>
    </section>
  );
}
