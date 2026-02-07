import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { FitResultCard } from '@/components/FitResultCard';
import { OutcomeBadge } from '@/components/OutcomeBadge';
import { ScrollReveal } from '@/components/ScrollReveal';
import { RotateCcw, Scale, Plane } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function ResultsDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const { results, unit, weight, weightUnit, clearResults, setCurrentView, setSelectedAirlineDetail } = useAppStore();

  // Flowing section animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(header,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger reveal
      const cardElements = cards.querySelectorAll('.result-card');
      gsap.fromTo(cardElements,
        { y: 40, opacity: 0, rotate: -1 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [results]);

  const handleRecheck = () => {
    clearResults();
    setCurrentView('check');
    scrollToPinCenter('hero');
  };

  const handleCompare = () => {
    setCurrentView('compare');
    // Flowing section — use GSAP ScrollToPlugin (no snap interference)
    gsap.to(window, { scrollTo: '#compare', duration: 0.6, ease: 'power2.inOut' });
  };

  const fitsCount = results.filter((r) => r.outcome === 'fits').length;
  const doesntFitCount = results.filter((r) => r.outcome === 'doesnt-fit').length;
  const unknownCount = results.filter((r) => r.outcome === 'unknown').length;

  if (results.length === 0) {
    return (
      <section
        ref={sectionRef}
        id="results"
        className="section-flowing py-20 z-50"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-h3 font-heading font-bold mb-4">No Results Yet</h2>
            <p className="text-muted-foreground mb-8">
              Select your bag type, enter dimensions, and choose airlines to see results.
            </p>
            <button
              onClick={handleRecheck}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3',
                'bg-accent text-background font-heading font-bold rounded-lg',
                'hover:brightness-110 transition-all duration-200 btn-lift'
              )}
            >
              Start checking
            </button>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="results"
      className="section-flowing py-20 z-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <span className="section-label block mb-4">RESULTS</span>
          <h2 className="text-h2 font-heading font-bold mb-4">YOUR RESULTS</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Based on the {weight ? 'size and weight' : 'size'} you entered vs each airline&apos;s published limits.
          </p>

          {/* Summary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {fitsCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <OutcomeBadge outcome="fits" showIcon={false} />
                <span className="font-mono text-lg">{fitsCount}</span>
              </div>
            )}
            {doesntFitCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                <OutcomeBadge outcome="doesnt-fit" showIcon={false} />
                <span className="font-mono text-lg">{doesntFitCount}</span>
              </div>
            )}
            {unknownCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full">
                <OutcomeBadge outcome="unknown" showIcon={false} />
                <span className="font-mono text-lg">{unknownCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {results.map((result) => (
            <div key={result.airline.code} className="result-card">
              <FitResultCard
                result={result}
                unit={unit}
                weightUnit={weightUnit}
                onClick={() => setSelectedAirlineDetail(result.airline.code)}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleRecheck}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-white/10 text-foreground font-medium rounded-lg',
              'hover:bg-white/20 transition-all duration-200 btn-lift',
              'border border-white/10'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Check another bag
          </button>
          
          <button
            onClick={handleCompare}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-accent text-background font-heading font-bold rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift'
            )}
          >
            <Scale className="w-4 h-4" />
            Compare all airlines
          </button>
        </div>
      </div>
    </section>
  );
}
