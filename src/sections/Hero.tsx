import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { setCurrentView } = useAppStore();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    const frame = frameRef.current;
    const scroll = scrollRef.current;

    if (!section || !headline || !sub || !cta || !frame || !scroll) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation on load
      const entranceTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      entranceTl
        .fromTo(frame, 
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.8 },
          0.1
        )
        .fromTo(headline,
          { opacity: 0, y: 26, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          0.2
        )
        .fromTo(sub,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.35
        )
        .fromTo(cta,
          { opacity: 0, y: 14, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5 },
          0.5
        )
        .fromTo(scroll,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          0.7
        );

      // Scroll-driven EXIT animation (70% - 100%)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headline, sub, cta, frame, scroll], { 
              opacity: 1, 
              x: 0, 
              y: 0, 
              scale: 1 
            });
          },
        },
      });

      // ENTRANCE (0% - 30%): Hold at settled state (entrance already played)
      // SETTLE (30% - 70%): Hold
      
      // EXIT (70% - 100%)
      scrollTl
        .fromTo(headline,
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(sub,
          { x: 0, opacity: 1 },
          { x: '40vw', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(cta,
          { x: 0, opacity: 1 },
          { x: '40vw', opacity: 0, ease: 'power2.in' },
          0.74
        )
        .fromTo(frame,
          { scale: 1, opacity: 1 },
          { scale: 1.08, opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(scroll,
          { opacity: 1 },
          { opacity: 0 },
          0.70
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    setCurrentView('check');
    scrollToPinCenter('bag-type');
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned flex items-center justify-center z-10"
    >
      {/* Sizer Frame (decorative) */}
      <div
        ref={frameRef}
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2
                   w-[72vw] h-[44vh] border border-white/20 rounded-xl pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1
          ref={headlineRef}
          className="text-h1 font-heading font-bold text-foreground mb-6"
        >
          WILL YOUR BAG FIT?
        </h1>
        
        <p
          ref={subRef}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
        >
          Check cabin, underseat, and checked limits for 30+ airlines in seconds.
        </p>
        
        <button
          ref={ctaRef}
          onClick={handleStart}
          className={cn(
            'inline-flex items-center gap-2 px-8 py-4',
            'bg-accent text-background font-heading font-bold text-lg rounded-lg',
            'hover:brightness-110 transition-all duration-200 btn-lift'
          )}
        >
          Start checking
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Scroll to begin
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
      </div>
    </section>
  );
}
