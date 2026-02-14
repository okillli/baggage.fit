# Full Codebase Audit — baggage.fit

**Date:** 2026-02-13
**Audited by:** 5 parallel agents (React, SEO, Tailwind, Vite, Bug Hunt)
**Scope:** All source files, configs, build output, and dependencies

---

## Executive Summary

**Total findings: 160+ across 5 audit domains** (deduplicated to ~80 unique issues)

| Severity | Count | Key Themes |
|----------|-------|------------|
| **CRITICAL** | 5 | Accessibility contrast, unused dependencies bloat, no code splitting, no skip link, accent color fails WCAG |
| **HIGH** | 18 | No error boundary, no error state for data fetch, GSAP ignores reduced-motion, missing OG tags, render-blocking fonts, framer-motion bloat, no vendor chunking |
| **MEDIUM** | 30+ | Stale fit results on unit toggle, misleading empty states, dead footer links, z-index conflicts, inconsistent design tokens, missing ARIA attributes |
| **LOW** | 30+ | Rounding drift, dead code, redundant GSAP registration, minor responsive issues |

---

## CRITICAL Issues (Fix Immediately)

### C1. Accent Color on Light Backgrounds Fails WCAG Contrast
**Files:** `index.css:8`, used in `AirlinesListPage`, `CompareTable`, `AirlineDetailContent`, `AirlinesBrowse`
**Problem:** `hsl(78, 100%, 62%)` (#D7FF3B) on white = **1.57:1** contrast. WCAG AA requires 4.5:1. Links using `text-accent` on the light AirlinesBrowse section are essentially invisible to low-vision users.
**Fix:** Define `--accent-on-light: hsl(78, 80%, 32%)` (~5:1 contrast on white). Use `text-accent-dark` in light-background contexts.

### C2. 37 of 49 Runtime Dependencies Are Completely Unused
**File:** `package.json`
**Problem:** shadcn/ui scaffolding installed 37 packages (`@hookform/resolvers`, `date-fns`, `react-hook-form`, `zod`, `recharts`, `vaul`, `cmdk`, `react-day-picker`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-resizable-panels`, `sonner`, 24 `@radix-ui/*` packages) that are never imported by application code.
**Impact:** Bloated `node_modules`, slower CI installs, larger attack surface.
**Fix:** Remove all 37 unused packages. Delete 51 unused `src/components/ui/` files.

### C3. Zero Route-Level Code Splitting
**File:** `main.tsx:5-8`
**Problem:** All routes eagerly imported — every visitor downloads the entire 593KB bundle. Users arriving at `/airlines/ryanair` from Google download all GSAP scroll machinery they'll never use.
**Fix:** `React.lazy()` + `<Suspense>` for each route. Estimated saving: ~50% reduction for non-home routes.

### C4. No Skip-to-Content Link (WCAG 2.4.1 Level A)
**Files:** `App.tsx`, `PageLayout.tsx`
**Problem:** No skip link exists. Keyboard users must tab through all header navigation on every page.
**Fix:** Add `<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to content</a>` as first child.

### C5. ~51 Unused shadcn/ui Component Files
**File:** `src/components/ui/` (53 files, only 2 used: `sheet.tsx`, `button.tsx`)
**Problem:** 51 unused component files slow TypeScript checking, pollute file searches, and some (like `chart.tsx`) import heavy libraries (`recharts` ~45KB gzip via `import *`).
**Fix:** Delete all unused UI component files.

---

## HIGH Issues (Fix Before Launch)

### H1. No React Error Boundary
**Impact:** Any runtime error crashes to white screen with no recovery.
**Fix:** Add `ErrorBoundary` around `<Routes>` in `main.tsx`.

### H2. No Error State for Failed Airline Data Fetch
**Files:** `appStore.ts:34-42`, `AirlinesBrowse.tsx`, `AirlinePage.tsx`, `AirlinesListPage.tsx`
**Problem:** Network failure → silent empty table, no error message, no retry button.
**Fix:** Add `airlinesError: string | null` to store. Show error UI with retry in all consumers.

### H3. GSAP Animations Ignore `prefers-reduced-motion`
**Files:** `Hero.tsx`, `BagTypePicker.tsx`, `ScrollReveal.tsx`, `VisualSizer.tsx`, `App.tsx`
**Problem:** CSS reduced-motion rules only affect CSS transitions. All JS-driven GSAP animations (entrance, scroll-scrub, snap, reveal) run at full motion.
**Fix:** Use `gsap.matchMedia()` to branch between full and reduced animation sets.

### H4. Missing Open Graph / Twitter Meta Tags
**Files:** `index.html`, `useSEO.ts`
**Problem:** No `og:image`, `og:type`, `og:description`, `twitter:card`, `twitter:image`. Sharing on social media produces a plain text link with no preview card.
**Fix:** Extend `useSEO` hook, add OG tags to `index.html`, create `og-image.png` (1200x630px).

### H5. Google Fonts Loaded via Render-Blocking CSS `@import`
**File:** `index.css:1`
**Problem:** Creates a 4-step waterfall (HTML → CSS → Google CSS → font files). Delays LCP by hundreds of ms.
**Fix:** Move to `<link>` tags in `index.html` with `<link rel="preconnect">`. Better: self-host fonts.

### H6. `framer-motion` (~32KB gzip) Imported for One Toggle Animation
**File:** `UnitToggle.tsx:2`
**Problem:** Entire framer-motion library for a single `layoutId` pill animation. App already has GSAP.
**Fix:** Replace with CSS transition or GSAP tween. Remove `framer-motion` from `package.json`.

### H7. Missing `robots.txt` and `sitemap.xml`
**File:** `public/` — neither file exists
**Problem:** 30+ airline detail pages discoverable only by link-following. No sitemap for Google.
**Fix:** Create `robots.txt`, generate `sitemap.xml` during build (in `prerender.mjs`).

### H8. No JSON-LD on Home Page
**File:** `App.tsx`
**Problem:** Home page has zero structured data. Should have `WebSite` + `Organization` schema.
**Fix:** Add JSON-LD script tag with `WebSite` schema.

### H9. Airline Detail Page Has No `<h1>`
**Files:** `AirlinePage.tsx`, `AirlineDetailContent.tsx:36`
**Problem:** Airline name rendered as `<h2>` (shared with Sheet context). Standalone pages lack `<h1>`.
**Fix:** Add `headingLevel` prop to `AirlineDetailContent`, default `h2` for Sheet, `h1` for page.

### H10. CompareTable Airline Names Are Non-Focusable Divs
**File:** `CompareTable.tsx:113-125`
**Problem:** Airline names use `<div onClick>` — no `role`, `tabIndex`, or keyboard handler. Keyboard/screen reader users cannot open airline details.
**Fix:** Change to `<button type="button">` with `aria-label`.

### H11. No Vendor Chunk Splitting
**File:** `vite.config.ts`
**Problem:** Single 593KB bundle. Any code change invalidates cache for all vendor code (~130KB stable).
**Fix:** Add `manualChunks` for react, gsap, ui vendors.

### H12. No Production Source Maps
**File:** `vite.config.ts`
**Problem:** Cannot debug production errors or use error monitoring tools.
**Fix:** Add `build.sourcemap: 'hidden'`.

### H13. Pre-rendering Not in Default `build` Script
**File:** `package.json:8-9`
**Problem:** `npm run build` does NOT pre-render. Most hosting platforms use `build`, not `build:prerender`.
**Fix:** Make pre-rendering the default: `"build": "tsc -b && vite build && node scripts/prerender.mjs"`.

### H14. Button Styles Duplicated 9+ Times (No Shared Component)
**Files:** `Hero.tsx`, `BagTypePicker.tsx`, `Footer.tsx`, `CheckYourBagPanel.tsx`, `AirlinePage.tsx`, `NotFoundPage.tsx`
**Problem:** Same ~80-char class string copy-pasted for primary CTA buttons. shadcn `Button` component exists but is unused.
**Fix:** Create CTA variants in `Button` CVA config or a dedicated `CTAButton`.

### H15. Hardcoded Hex Colors Instead of Theme Tokens
**Files:** `AirlinesBrowse.tsx`, `DotGridBackground.tsx`
**Problem:** `#F2F2F2` and `#1A1A1A` used as arbitrary values instead of CSS variables.
**Fix:** Add `--surface-light` token. Use `bg-background` for `#1A1A1A`.

### H16. Dark Mode Config Is Inert
**File:** `tailwind.config.js:3`
**Problem:** `darkMode: ["class"]` configured but no `.dark {}` block in CSS. The `dark:` prefix never activates.
**Fix:** Remove `darkMode: ["class"]` (app is dark-only) or implement proper theming.

### H17. ScrollTrigger.refresh() Fires Before Collapsible Animation Completes
**File:** `CheckYourBagPanel.tsx:44-52`
**Problem:** `requestAnimationFrame` (~16ms) fires while 200ms collapsible animation is mid-flight, causing wrong pin/snap calculations.
**Fix:** Use `setTimeout(() => ScrollTrigger.refresh(), 250)` or listen for `animationend`.

### H18. Misleading CompareTable Empty State
**File:** `CompareTable.tsx:72-76`
**Problem:** Shows "No airlines found with data for this bag type" when fit filter returns zero matches. Users think the app is broken.
**Fix:** Contextual messages based on active filter/search state.

---

## MEDIUM Issues (Fix Soon)

### M1. `setUnit` / `setWeightUnit` Don't Clear Fit Results
**File:** `appStore.ts:60-78`
**Problem:** Toggling cm/in or kg/lb converts values but leaves stale fit results computed from pre-conversion values.
**Fix:** Add `results: []` to both `set()` calls.

### M2. Zero Dimensions Produce "Fits" Everywhere
**File:** `appStore.ts:82-116`
**Problem:** Empty inputs = 0, and `0 <= anyMax` = "fits". `validateDimensions` exists but is never called.
**Fix:** Call `validateDimensions` before `checkFit`. Disable button when invalid.

### M3. CompareTable Weight Column Always Shows kg
**File:** `CompareTable.tsx:133, 177`
**Problem:** Hardcodes `${allowance.maxKg} kg` regardless of user's weight unit preference.
**Fix:** Pass `weightUnit` prop, use `formatWeight()`.

### M4. Fit Filter Chip Counts Ignore Region Filter
**File:** `AirlinesBrowse.tsx:71-73`
**Problem:** Shows "Fits (10)" but only 5 visible rows after region filtering.
**Fix:** Compute counts from region-filtered airlines.

### M5. AirlineDetailSheet Re-renders on Every Keystroke
**File:** `AirlineDetailSheet.tsx:14-24`
**Problem:** Subscribes to 9 store values without selectors. Re-renders on dimension/weight input even when closed.
**Fix:** Use Zustand selectors. Gate expensive reads behind open state.

### M6. Filter/Toggle Buttons Missing `aria-pressed`
**Files:** `BagTypeCard.tsx:31`, `AirlinesBrowse.tsx:127-183`
**Problem:** Selected state communicated only visually. Screen readers can't distinguish active toggle.
**Fix:** Add `aria-pressed={isSelected}` to all toggle buttons.

### M7. Search Inputs Lack Accessible Labels
**Files:** `CompareTable.tsx:87`, `AirlinesListPage.tsx:68`
**Problem:** Rely solely on `placeholder` text. Not announced by all screen readers.
**Fix:** Add `aria-label="Search airlines"`.

### M8. `100vh` on Mobile Causes Viewport Issues
**File:** `index.css:110`
**Problem:** `h-screen` = `100vh` includes area behind iOS Safari address bar.
**Fix:** Use `height: 100dvh` with `100vh` fallback.

### M9. Touch Targets Below 44px
**File:** `HeaderNav.tsx:67-78`
**Problem:** Mobile nav buttons ~24px tall. Filter chips ~28px. Below WCAG 2.5.8 minimum.
**Fix:** Add `min-h-[44px]` to mobile touch targets.

### M10. `transition-all` Overused (22 Locations)
**Problem:** Transitions every CSS property including layout-triggering ones.
**Fix:** Replace with specific transitions: `transition-colors`, `transition-[transform,filter]`, etc.

### M11. `white/` Opacity Classes Instead of Semantic Tokens (21 Locations)
**Problem:** `bg-white/5`, `border-white/10` used when `bg-secondary`, `border-border` exist.
**Fix:** Replace with semantic tokens for theme-awareness.

### M12. Inconsistent "Doesn't Fit" Red Shade
**Problem:** `red-400` in BagTypeAllowanceCard vs `red-500` everywhere else.
**Fix:** Standardize on `red-500` or `destructive` token.

### M13. Inconsistent "Fits" Green
**Problem:** CompareTable uses `text-green-600` while all other fit indicators use `text-accent`.
**Fix:** Change CompareTable to `text-accent`.

### M14. UnitToggle Not Announced as Selection Group
**File:** `UnitToggle.tsx`
**Fix:** Add `role="radiogroup"` on container, `role="radio"` + `aria-checked` on buttons.

### M15. No Image Optimization
**File:** `BagTypeCard.tsx:47`
**Problem:** JPEG only, no `loading="lazy"`, no `width/height`, no WebP/AVIF.
**Fix:** Add lazy loading, dimensions, convert to WebP.

### M16. Hero Animation Delays LCP
**File:** `Hero.tsx:35-59`
**Problem:** `<h1>` starts at `opacity: 0`, visible after ~0.9s. Direct LCP penalty.
**Fix:** Make h1 visible by default or reduce entrance delay.

### M17. `.section-pinned` Split Across Two CSS Files
**Files:** `index.css:167-169`, `App.css:18-26`
**Fix:** Consolidate into `index.css`.

### M18. 6 Unused Custom CSS Component Classes
**File:** `index.css:89-125`
**Problem:** `.glow-accent`, `.sizer-frame`, `.chip-selected`, `.card-hover`, `.badge-fits`, `.badge-doesnt-fit`, `.badge-unknown` — never used.
**Fix:** Delete ~30 lines of dead CSS.

### M19. No `<caption>` on Data Table
**File:** `CompareTable.tsx:93`
**Fix:** Add `<caption class="sr-only">` with bag type context.

### M20. Heading Typography Uses `px` Instead of `rem`
**File:** `index.css:130-146`
**Problem:** `clamp(44px, 6vw, 84px)` doesn't respond to browser font-size preference.
**Fix:** Convert to `rem`: `clamp(2.75rem, 6vw, 5.25rem)`.

### M21. Duplicate Region-to-Country Mapping
**Files:** `AirlinesBrowse.tsx:31-36`, `AirlinesListPage.tsx:12-17`
**Fix:** Extract shared `src/lib/regions.ts`.

### M22. Duplicate Weight Conversion (Hardcoded 0.453592)
**Files:** `AirlinePage.tsx:14-16`, `appStore.ts:80-82`
**Problem:** Manual conversion instead of `convertWeightToKg()` from `fitLogic.ts`.
**Fix:** Use existing utility function.

### M23. `kimi-plugin-inspect-react` Runs in Production
**File:** `vite.config.ts:9`
**Fix:** Wrap in `mode === 'development'` guard.

### M24. Footer Links All Dead (`href="#"`)
**File:** `Footer.tsx:42-80`
**Fix:** Implement pages or remove links.

### M25. No Input Validation Feedback
**Files:** `DimensionInput.tsx`, `WeightInput.tsx`
**Fix:** Red border on invalid, disable Check button, inline error text.

### M26. Home Page Missing `useSEO` Call
**File:** `App.tsx`
**Problem:** Navigating away and back strips meta description from DOM.
**Fix:** Add `useSEO()` in `App.tsx`.

### M27. Ryanair Checked Bag (null maxCm) Always Shows "Unknown"
**File:** `airlines.json:13`, `fitLogic.ts:103-113`
**Problem:** Weight passes but overall outcome = "unknown" because dimensions are null.
**Fix:** Show separate dimension/weight badges, or return "fits" when only checkable metric passes.

### M28. "Check your bag against [airline]" CTA Loses Context
**File:** `AirlinePage.tsx:77-82`
**Problem:** Links to `/` with no state. User starts from scratch.
**Fix:** Pass `state={{ focusAirline: airline.code }}` via React Router.

---

## LOW Issues (Fix When Convenient)

<details>
<summary>30+ low-severity findings (click to expand)</summary>

- **Cumulative rounding drift** on repeated unit toggles (`appStore.ts:62`)
- **Dead exported functions** in `fitLogic.ts` (`getOutcomeText`, `getOutcomeColor`, `validateDimensions`)
- **GSAP registered 5 times** — consolidate to `src/lib/gsap.ts`
- **Duplicate `countryToFlag` logic** in `AirlineDetailContent.tsx` and `AirlinesListPage.tsx`
- **`new Date().getFullYear()`** called during render in 5 files
- **Naming collision**: store `checkFit` vs utility `checkFit`
- **`dangerouslySetInnerHTML`** for JSON-LD without `</script>` escaping
- **`useIsMobile` returns false during SSR/prerender**
- **No `aria-live` region** for fit results announcement
- **Focus not managed** after programmatic scroll
- **Breadcrumb `<nav>` missing `aria-label`** (`AirlinePage.tsx:98`)
- **Loading spinners lack `role="status"`**
- **Number inputs missing `inputmode="decimal"`**
- **Breadcrumb not an `<ol>` list**
- **Footer `<h2>` for branding** — should be `<p>`
- **No web app manifest**
- **No canonical URL on home page**
- **404 page returns HTTP 200**
- **Pre-render fixed 1500ms wait**
- **Pre-render server missing `.jpg` MIME type**
- **Duplicate `will-change-transform` definitions** (3 copies)
- **Duplicate `html { scroll-behavior: auto }` declarations**
- **Duplicate `prefers-reduced-motion` blocks** in `index.css` and `App.css`
- **Duplicate font config** in CSS and Tailwind config
- **Redundant `font-heading font-bold`** on heading elements (already set globally)
- **"Check another bag" doesn't reset inputs** (`Footer.tsx:8`)
- **"Check" nav button never shows active** (`HeaderNav.tsx:63`)
- **No scroll restoration on route transitions**
- **VisualSizer label missing unit** (`VisualSizer.tsx:134`)
- **Weight gauge caps at 100%** — no "how much over" indication
- **`formatDimensions` doesn't handle 2-element arrays**
- **Slug collision risk** for similarly-named airlines
- **CompareTable mobile card border-radius** inconsistent (`rounded-lg` vs `rounded-xl`)
- **BagTypePicker 1→3 column jump** (no 2-column intermediate)
- **Inconsistent section vertical padding** (scroll app `py-20` vs pages `py-10`)
- **Duplicate Tailwind animation packages** (`tailwindcss-animate` + `tw-animate-css`)

</details>

---

## Recommended Fix Order

### Phase 1 — Quick Wins (1-2 hours, biggest impact)
1. Delete 51 unused UI component files
2. Remove 37 unused npm packages
3. Add `React.lazy()` for route-level code splitting
4. Add Error Boundary
5. Add `airlinesError` state + retry UI
6. Fix `kimi-plugin-inspect-react` dev-only guard

### Phase 2 — Accessibility & SEO (2-4 hours)
7. Fix accent color contrast on light backgrounds
8. Add skip-to-content link
9. Add `aria-pressed` to all toggle buttons
10. Add `aria-label` to search inputs and dropdowns
11. Add OG/Twitter meta tags + `og-image.png`
12. Create `robots.txt` + generate `sitemap.xml`
13. Add JSON-LD to home page
14. Fix airline detail `<h1>`

### Phase 3 — Performance (2-3 hours)
15. Move Google Fonts to `<link>` tags with preconnect
16. Replace `framer-motion` with CSS transition
17. Add `manualChunks` vendor splitting
18. Add `build.sourcemap: 'hidden'`
19. Convert images to WebP + add lazy loading
20. Fix `100vh` → `100dvh` for mobile

### Phase 4 — UX & Logic (2-3 hours)
21. Clear results on unit toggle
22. Validate dimensions before checkFit
23. Show weight in user's preferred unit
24. Fix fit filter counts to respect region filter
25. Fix misleading empty state messages
26. Add GSAP reduced-motion support
27. Fix ScrollTrigger.refresh timing

### Phase 5 — Code Quality (1-2 hours)
28. Consolidate GSAP registration
29. Extract shared button component
30. Replace hardcoded colors with tokens
31. Replace `transition-all` with specific transitions
32. Extract shared region mapping
33. Remove dead code and CSS
