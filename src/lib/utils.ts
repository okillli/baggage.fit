import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Smooth-scroll to a pinned section's settled position (center of its pin range)
 * so the entrance animation has completed and content is visible.
 * Uses GSAP ScrollToPlugin for smooth animation. Since the target is the exact
 * snap center, GSAP's snap system agrees with the final position and doesn't fight.
 */
export function scrollToPinCenter(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const spacer = section.closest('.pin-spacer') || section;
  const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
  const pinScroll = spacer.clientHeight - window.innerHeight;
  const target = spacerTop + pinScroll * 0.5;
  gsap.to(window, { scrollTo: target, duration: 0.8, ease: 'power2.inOut' });
}
