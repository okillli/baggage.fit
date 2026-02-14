import { useRef, useLayoutEffect } from 'react';
import { gsap } from '@/lib/gsap-setup';
import { cn, gsapScrollTo } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { BagTypeCard } from '@/components/BagTypeCard';
import type { BagType } from '@/types';
import { ArrowRight } from 'lucide-react';

const bagTypes: { type: BagType; title: string; description: string; image: string }[] = [
  {
    type: 'cabin',
    title: 'Cabin bag',
    description: 'Carry-on that goes in the overhead.',
    image: '/images/bag_cabin.jpg',
  },
  {
    type: 'underseat',
    title: 'Underseat',
    description: 'Personal item under the seat in front.',
    image: '/images/bag_underseat.jpg',
  },
  {
    type: 'checked',
    title: 'Checked',
    description: 'Hold luggage with size + weight rules.',
    image: '/images/bag_checked.jpg',
  },
];

export function BagTypePicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { bagType, setBagType, setCheckPanelOpen } = useAppStore();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const header = headerRef.current!;
      const cards = Array.from(cardsRef.current!.children);
      const cta = ctaRef.current!;

      if (prefersReducedMotion) {
        gsap.set([header, ...cards, cta], { opacity: 1 });
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: false,
          },
        });
        return;
      }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.3,
        },
      });

      // ENTRANCE (0% - 26%): Stagger Rise
      scrollTl
        .fromTo(header,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          0
        )
        .fromTo(cards,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.14, stagger: 0.03, ease: 'power2.out' },
          0.05
        )
        .fromTo(cta,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' },
          0.16
        );

      // SETTLE (26% - 70%): Hold

      // EXIT (70% - 100%): Elements fly out
      scrollTl
        .fromTo(header,
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0, duration: 0.30, ease: 'power2.in' },
          0.70
        )
        .fromTo(cards,
          { x: 0, opacity: 1, rotate: 0 },
          { x: '40vw', opacity: 0, rotate: 3, duration: 0.26, stagger: 0.02, ease: 'power2.in' },
          0.72
        )
        .fromTo(cta,
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0, duration: 0.25, ease: 'power2.in' },
          0.75
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    setCheckPanelOpen(true);
    gsapScrollTo('#airlines');
  };

  return (
    <section
      ref={sectionRef}
      id="bag-type"
      className="section-pinned flex flex-col items-center justify-center z-pin-bagtype"
    >
      <div ref={contentRef} className="w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <span className="section-label block mb-4">
            STEP 1 / BAG TYPE
          </span>
          <h2 className="text-h2 font-heading font-bold">
            WHAT ARE YOU CARRYING?
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {bagTypes.map((bag) => (
            <BagTypeCard
              key={bag.type}
              type={bag.type}
              title={bag.title}
              description={bag.description}
              imageSrc={bag.image}
              isSelected={bagType === bag.type}
              onClick={() => setBagType(bag.type)}
              className="h-full"
            />
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="text-center">
          <button
            onClick={handleNext}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-accent text-accent-foreground font-heading font-bold rounded-lg',
              'hover:brightness-110 transition-all duration-200 btn-lift'
            )}
          >
            Next: browse airlines
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
