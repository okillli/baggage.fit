import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { DimensionInput } from '@/components/DimensionInput';
import { VisualSizer } from '@/components/VisualSizer';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function DimensionsInput() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { dimensions, unit, bagType, setDimensions, setUnit, setCurrentView } = useAppStore();

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
  }, []);

  const handleNext = () => {
    setCurrentView('check');
    scrollToPinCenter('airline-selector');
  };

  // Default max dimensions for visualization
  const defaultMaxDims: Record<string, [number, number, number]> = {
    cabin: [55, 40, 20],
    underseat: [40, 30, 20],
    checked: [90, 75, 43],
  };

  return (
    <section
      ref={sectionRef}
      id="dimensions"
      className="section-pinned flex flex-col items-center justify-center z-30"
    >
      <div ref={contentRef} className="w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-label block mb-4">
            STEP 2 / SIZE
          </span>
          <h2 className="text-h2 font-heading font-bold">
            ENTER DIMENSIONS
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Input Panel */}
          <div
            className={cn(
              'bg-white/5 border border-white/10 rounded-xl p-6',
              'flex flex-col justify-center'
            )}
          >
            <DimensionInput
              dimensions={dimensions}
              unit={unit}
              onChange={setDimensions}
              onUnitChange={setUnit}
              className="mb-6"
            />
            
            <button
              onClick={handleNext}
              className={cn(
                'w-full inline-flex items-center justify-center gap-2 px-6 py-4',
                'bg-accent text-background font-heading font-bold rounded-lg',
                'hover:brightness-110 transition-all duration-200 btn-lift'
              )}
            >
              Next: select airlines
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Diagram Panel */}
          <div
            className={cn(
              'bg-black/40 border border-white/10 rounded-xl p-6',
              'flex flex-col items-center justify-center min-h-[300px]'
            )}
          >
            <VisualSizer
              dimensions={dimensions}
              maxDimensions={defaultMaxDims[bagType]}
              unit={unit}
              outcome="unknown"
              className="w-full h-full"
            />
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Your bag vs the limit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
