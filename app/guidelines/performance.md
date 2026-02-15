# Performance Guidelines — baggage.fit

## Code Deduplication

### Shared Logic in fitLogic.ts
All fit-checking logic lives in `src/lib/fitLogic.ts`. Functions:
- `checkFit()` — batch check against multiple airlines (used by store)
- `checkBagTypeFit()` — single airline + bag type check (used by InlineFitChecker)
- Unit conversion: `convertToCm()`, `convertWeightToKg()`, `convertKgToLb()`

**Rule**: If you need to compare user dimensions against airline limits, use these functions. Never duplicate the sorting/comparison logic.

### Shared Hooks in lib/hooks.ts
- `useFitMap(fitResults)` — converts `FitResult[]` to a `Map<code, FitResult>` for O(1) lookups

**Rule**: When multiple components need the same derived data, extract a hook into `lib/hooks.ts`.

## Memoization

- `useMemo` for expensive computations (sorting, filtering, mapping large arrays)
- `useCallback` for functions passed as props to child components
- Do NOT memoize trivial computations (simple string concatenation, boolean checks)

## Data Fetching

- Airline data is fetched ONCE via `loadAirlines()` in the Zustand store
- Components read from the store — never fetch independently
- The JSON is preloaded via `<link rel="preload">` in `index.html`

## Bundle Size

- GSAP is the largest dependency — import only needed plugins via `src/lib/gsap-setup.ts`
- Fuse.js is used only in AirlineSearch — consider dynamic import if bundle grows
- Keep `node_modules` additions minimal — prefer native solutions

## Component Size

- **Target: under 300 lines per file**
- When a component exceeds this, extract sub-components or utility functions
- Sub-components that are only used by one parent can live in the same directory

## GSAP Performance

- ScrollTrigger: use `scrub: true` for scroll-driven animations (not time-based)
- Batch DOM reads/writes — never mix reading and writing in the same GSAP callback
- Kill ScrollTriggers on unmount to prevent memory leaks:
  ```tsx
  useEffect(() => {
    const st = ScrollTrigger.create({...});
    return () => st.kill();
  }, []);
  ```

## Image & Asset Optimization

- SVG for icons and logos (not PNG/JPG)
- Flags: emoji or lightweight SVG sprites
- Lazy load below-fold images if added in the future

## localStorage

- `STORAGE_KEY = 'baggage-fit-prefs'` in appStore.ts
- Persists: dimensions, unit, weight, weightUnit, bagType
- Every setter calls `persistState()` — no manual save needed
- Read on hydration only (store initialization)
