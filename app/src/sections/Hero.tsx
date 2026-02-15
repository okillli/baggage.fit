import { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { gsap } from '@/lib/gsap-setup';
import { cn, gsapScrollTo } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { AirlineSearch } from '@/components/AirlineSearch';
import { airlineToSlug } from '@/lib/slugs';
import { countryToFlag } from '@/lib/format';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Search as SearchIcon } from 'lucide-react';
const POPULAR_CODES = ['RYR', 'EZY', 'DAL', 'DLH', 'UAL', 'AAL', 'BAW', 'UAE'];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { airlines, loadAirlines, setCurrentView, setCheckPanelOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => { loadAirlines(); }, [loadAirlines]);

  const popularAirlines = useMemo(
    () => airlines.filter((a) => POPULAR_CODES.includes(a.code)),
    [airlines]
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const search = searchRef.current;
    const chips = chipsRef.current;
    const cta = ctaRef.current;
    const frame = frameRef.current;
    const scroll = scrollRef.current;

    if (!section || !headline || !sub || !search || !chips || !cta || !frame || !scroll) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headline, sub, search, chips, cta, frame, scroll], { opacity: 1 });
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: false,
          },
        });
        return;
      }

      // Entrance animation
      const entranceTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      entranceTl
        .fromTo(frame, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.1)
        .fromTo(headline, { opacity: 0, y: 26, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.2)
        .fromTo(sub, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 0.35)
        .fromTo(search, { opacity: 0, y: 14, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, 0.45)
        .fromTo(chips, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55)
        .fromTo(cta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.65)
        .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.75);

      // Scroll-driven EXIT
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.3,
          onLeaveBack: () => {
            gsap.set([headline, sub, search, chips, cta, frame, scroll], {
              opacity: 1, x: 0, y: 0, scale: 1,
            });
          },
        },
      });

      scrollTl
        .fromTo(headline, { x: 0, opacity: 1 }, { x: '-40vw', opacity: 0, duration: 0.30, ease: 'power2.in' }, 0.70)
        .fromTo(sub, { x: 0, opacity: 1 }, { x: '40vw', opacity: 0, duration: 0.28, ease: 'power2.in' }, 0.72)
        .fromTo(search, { opacity: 1, y: 0 }, { opacity: 0, y: 30, duration: 0.26, ease: 'power2.in' }, 0.72)
        .fromTo(chips, { opacity: 1 }, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0.74)
        .fromTo(cta, { opacity: 1 }, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0.76)
        .fromTo(frame, { scale: 1, opacity: 1 }, { scale: 1.08, opacity: 0, duration: 0.30, ease: 'power2.in' }, 0.70)
        .fromTo(scroll, { opacity: 1 }, { opacity: 0, duration: 0.30 }, 0.70);
    }, section);

    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    setCheckPanelOpen(true);
    setCurrentView('browse');
    gsapScrollTo('#airlines');
  };

  const handleBrowse = () => {
    setCurrentView('browse');
    gsapScrollTo('#airlines');
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center z-pin-hero"
    >
      {/* Decorative frame */}
      <div
        ref={frameRef}
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2
                   w-[72vw] h-[44vh] border border-foreground/20 rounded-xl pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 w-full max-w-2xl mx-auto">
        <h1
          ref={headlineRef}
          className="text-h1 font-heading font-bold text-foreground mb-4"
        >
          WILL YOUR BAG FIT?
        </h1>

        <p
          ref={subRef}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8"
        >
          Check baggage size and weight limits for 40+ airlines
        </p>

        {/* Primary action: airline search */}
        <div ref={searchRef} className="relative z-10 mb-6">
          <AirlineSearch
            airlines={airlines}
            placeholder='Search airline (e.g. "Ryanair")'
            size="large"
          />
        </div>

        {/* Popular airline chips */}
        <div ref={chipsRef} className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Popular airlines">
          <span className="text-xs text-muted-foreground/60 self-center mr-1" aria-hidden="true">Popular:</span>
          {popularAirlines.map((airline) => (
            <button
              key={airline.code}
              onClick={() => navigate(`/airlines/${airlineToSlug(airline.name)}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] bg-foreground/8 border border-foreground/15 rounded-full text-sm text-foreground/80 hover:bg-foreground/15 hover:text-foreground transition-all"
            >
              <span className="text-sm">{countryToFlag(airline.country)}</span>
              {airline.name}
            </button>
          ))}
        </div>

        {/* Secondary CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStart}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-accent text-accent-foreground font-heading font-bold rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift'
            )}
          >
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
            Check your bag
          </button>
          <button
            onClick={handleBrowse}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-foreground/10 border border-foreground/20 text-foreground font-heading font-bold rounded-lg',
              'hover:bg-foreground/15 transition-all duration-200'
            )}
          >
            Browse all airlines
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
