import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn, scrollToPinCenter } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { BagTypeCard } from '@/components/BagTypeCard';
import type { BagType } from '@/types';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

  const { bagType, setBagType, setCurrentView } = useAppStore();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Set initial state - visible but ready for animation
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
    scrollToPinCenter('dimensions');
  };

  return (
    <section
      ref={sectionRef}
      id="bag-type"
      className="section-pinned flex flex-col items-center justify-center z-20"
    >
      <div ref={contentRef} className="w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-label block mb-4">
            STEP 1 / BAG TYPE
          </span>
          <h2 className="text-h2 font-heading font-bold">
            WHAT ARE YOU CARRYING?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
        <div className="text-center">
          <button
            onClick={handleNext}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-white/10 text-foreground font-medium rounded-lg',
              'hover:bg-white/20 transition-all duration-200 btn-lift',
              'border border-white/10'
            )}
          >
            Next: enter dimensions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
