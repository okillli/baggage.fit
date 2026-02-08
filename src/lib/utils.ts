import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Snap pause (used to prevent snap during overlay open/close) ---

let _snapPaused = false;
let _snapTimer: ReturnType<typeof setTimeout> | null = null;

export function pauseSnap(durationMs = 500) {
  _snapPaused = true;
  if (_snapTimer) clearTimeout(_snapTimer);
  _snapTimer = setTimeout(() => { _snapPaused = false; }, durationMs);
}

export function isSnapPaused() { return _snapPaused; }

// --- Pointer-events guard for programmatic scroll ---

function withPointerGuard(onComplete?: () => void) {
  const main = document.querySelector('main') as HTMLElement | null;
  if (main) main.style.pointerEvents = 'none';
  return () => {
    if (main) main.style.pointerEvents = '';
    onComplete?.();
  };
}

/**
 * Smooth-scroll to a flowing section (non-pinned).
 * Disables pointer-events on <main> during animation to prevent click-through.
 */
export function gsapScrollTo(target: string | number, options?: { duration?: number; ease?: string }) {
  const restore = withPointerGuard();
  gsap.to(window, {
    scrollTo: target,
    duration: options?.duration ?? 0.8,
    ease: options?.ease ?? 'power2.inOut',
    onComplete: restore,
  });
}

/**
 * Smooth-scroll to a pinned section's settled position (center of its pin range)
 * so the entrance animation has completed and content is visible.
 * Disables pointer-events on <main> during animation to prevent click-through.
 */
export function scrollToPinCenter(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const spacer = section.closest('.pin-spacer') || section;
  const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
  const pinScroll = spacer.clientHeight - window.innerHeight;
  const target = spacerTop + pinScroll * 0.5;
  const distance = Math.abs(target - window.scrollY);
  const duration = Math.min(Math.max(1.0, (distance / window.innerHeight) * 0.55), 2.0);
  const restore = withPointerGuard();
  gsap.to(window, { scrollTo: { y: target, autoKill: false }, duration, ease: 'power2.inOut', onComplete: restore });
}
