import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DotGridBackground } from '@/components/DotGridBackground';
import { HeaderNav } from '@/components/HeaderNav';
import { Hero } from '@/sections/Hero';
import { BagTypePicker } from '@/sections/BagTypePicker';
import { AirlinesBrowse } from '@/sections/AirlinesBrowse';
import { Footer } from '@/sections/Footer';
import { AirlineDetailSheet } from '@/components/AirlineDetailSheet';
import { useAppStore } from '@/store/appStore';
import { isSnapPaused } from '@/lib/utils';
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
          // Don't snap while overlay is open or just closed
          const { selectedAirlineDetail } = useAppStore.getState();
          if (selectedAirlineDetail !== null || isSnapPaused()) return value;

          const pinned = ScrollTrigger.getAll()
            .filter((st) => st.vars.pin)
            .sort((a, b) => a.start - b.start);

          if (pinned.length === 0) return value;

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
          const lastCenter = pinnedRanges[pinnedRanges.length - 1]?.center ?? 0;

          // Bridge the gap between last pin and first flowing section:
          // the pin-spacer leaves ~100vh of dead space after the pin ends.
          // Snap users to either the last pin center or the flowing section.
          if (value > lastEnd) {
            const airlinesEl = document.getElementById('airlines');
            if (airlinesEl) {
              const airlinesNorm = (airlinesEl.getBoundingClientRect().top + scrollY) / snapEnd;
              // Snap to whichever is closer
              return Math.abs(value - lastCenter) < Math.abs(value - airlinesNorm)
                ? lastCenter
                : airlinesNorm;
            }
            return value;
          }

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

        {/* Flowing Sections */}
        <AirlinesBrowse />
        <Footer />
      </main>

      {/* Airline detail overlay */}
      <AirlineDetailSheet />
    </div>
  );
}

export default App;
