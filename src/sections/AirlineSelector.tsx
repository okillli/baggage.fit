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
      // Set initial state
      gsap.set(content, { opacity: 1, y: 0 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE (0% - 25%): Fade in and slide up
      scrollTl.fromTo(content,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0
      );

      // SETTLE: Hold position (no exit fade — next section covers via z-index)
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
        <div className="text-center mb-8">
          <span className="section-label block mb-4">
            STEP 3 / AIRLINE
          </span>
          <h2 className="text-h2 font-heading font-bold">
            WHO ARE YOU FLYING?
          </h2>
        </div>

        {/* Search */}
        <div className="origin-center">
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
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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
