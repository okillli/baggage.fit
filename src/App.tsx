import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DotGridBackground } from '@/components/DotGridBackground';
import { HeaderNav } from '@/components/HeaderNav';
import { Hero } from '@/sections/Hero';
import { BagTypePicker } from '@/sections/BagTypePicker';
import { DimensionsInput } from '@/sections/DimensionsInput';
import { AirlineSelector } from '@/sections/AirlineSelector';
import { ResultsDashboard } from '@/sections/ResultsDashboard';
import { CompareMode } from '@/sections/CompareMode';
import { Footer } from '@/sections/Footer';
import { AirlineDetailSheet } from '@/components/AirlineDetailSheet';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const snapTriggerRef = useRef<ScrollTrigger | null>(null);

  // Global scroll snap configuration — computes ranges dynamically
  // so it always reflects the latest ScrollTriggers (handles async loads & resize).
  useEffect(() => {
    snapTriggerRef.current = ScrollTrigger.create({
      snap: {
        snapTo: (value: number) => {
          const pinned = ScrollTrigger.getAll()
            .filter((st) => st.vars.pin)
            .sort((a, b) => a.start - b.start);

          if (pinned.length === 0) return value;

          // Derive the effective scroll range from value & scrollY so we
          // normalise in the same coordinate space GSAP uses.  The snap
          // ScrollTrigger's internal `end` may be stale after async DOM
          // changes (e.g. airline list loading), whereas
          // ScrollTrigger.maxScroll(window) reflects the current DOM.
          // Using scrollY / value keeps us consistent with `value`.
          const scrollY = window.scrollY;
          const snapEnd =
            value > 0.001 && scrollY > 1
              ? scrollY / value
              : ScrollTrigger.maxScroll(window);

          if (!snapEnd) return value;

          const pinnedRanges = pinned.map((st) => ({
            start: st.start / snapEnd,
            end: (st.end ?? st.start) / snapEnd,
            center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / snapEnd,
          }));

          const lastEnd = pinnedRanges[pinnedRanges.length - 1]?.end ?? 0;

          // Allow free scroll after all pinned sections (flowing content)
          if (value > lastEnd + 0.02) return value;

          // Within or between pinned sections: snap to nearest center
          return pinnedRanges.reduce(
            (closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value)
                ? r.center
                : closest,
            pinnedRanges[0]?.center ?? 0
          );
        },
        duration: { min: 0.2, max: 0.4 },
        delay: 0,
        ease: 'power2.out',
      },
    });

    return () => {
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
      }
    };
  }, []);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background */}
      <DotGridBackground variant="dark" />

      {/* Navigation */}
      <HeaderNav />

      {/* Main Content */}
      <main className="relative">
        {/* Pinned Sections (z-index stacking) */}
        <Hero />
        <BagTypePicker />
        <DimensionsInput />
        <AirlineSelector />

        {/* Flowing Sections */}
        <ResultsDashboard />
        <CompareMode />
        <Footer />
      </main>

      {/* Airline detail overlay */}
      <AirlineDetailSheet />
    </div>
  );
}

export default App;
