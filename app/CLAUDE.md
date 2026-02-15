# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Guidelines

Project-specific guidelines live in `guidelines/`:
- **[accessibility.md](guidelines/accessibility.md)** — ARIA patterns, heading hierarchy, reduced motion, keyboard nav
- **[design-system.md](guidelines/design-system.md)** — CSS variable tokens, input/badge styling, typography, spacing
- **[seo.md](guidelines/seo.md)** — Meta tags, OG, pre-rendering, sitemap, structured data
- **[performance.md](guidelines/performance.md)** — Code dedup, shared hooks, memoization, GSAP, bundle size

**Always consult the relevant guideline before modifying UI, adding pages, or changing styling.**

## Architecture

### Scroll System (GSAP ScrollTrigger + ScrollToPlugin)

The app uses a **search-first** layout with **1 pinned + 2 flowing** sections:

```
Hero (pinned, z-10) → AirlinesBrowse (flowing) → Footer (flowing)
```

The Hero section has a pinned scroll range with entrance/exit animations driven by scrub.

After the pinned section, **flowing sections** (AirlinesBrowse, Footer) scroll normally.

**Global snap** (`App.tsx`): A single `ScrollTrigger.create({ snap })` snaps to the center of the Hero's scroll range. Free scroll is allowed past the pin for flowing content.

**Stale snap end fix**: The snap callback derives `snapEnd = scrollY / value` instead of relying on the snap trigger's internal `end`, which can go stale when async content (airline data) changes page height.

### Search-First UX

- **Hero** has an airline search combobox (Fuse.js fuzzy search) as the primary CTA
- Popular airline chips below the search bar for quick access
- **AirlinesBrowse** is the main destination: CompareTable showing ALL 3 bag types as columns + collapsible `CheckYourBagPanel`
- `AirlineDetailSheet` opens as a Radix Sheet overlay with inline fit checker
- Fit badges appear inline in the CompareTable after the user checks their bag

### Programmatic Scroll Navigation

- **Pinned sections**: Use `scrollToPinCenter(sectionId)` from `src/lib/utils.ts`.
- **Flowing sections**: Use `gsap.to(window, { scrollTo: '#section-id' })` directly.
- **Never use native `behavior: 'smooth'`** — it competes with the GSAP snap system.

### State Management (Zustand)

`src/store/appStore.ts` — Single Zustand store with localStorage persistence (`baggage-fit-prefs`).
- User inputs: `bagType`, `dimensions`, `unit`, `weight`, `weightUnit`
- Data: `airlines[]` (fetched once from `/data/airlines.json`), `airlinesLoading`
- Results: `results[]` (computed fit outcomes)
- UI: `selectedAirlineDetail`, `compareSort`, `checkPanelOpen`

Key action: `checkFit(airlines)` compares user dimensions against ALL passed airlines. Handles two formats: per-dimension `[L, W, H]` and total-dimension `[158]`.

### Fit Logic

`src/lib/fitLogic.ts` — Pure functions for dimension/weight checking:
- `checkFit()` — batch check against multiple airlines (used by store)
- `checkBagTypeFit()` — single airline + bag type check (used by InlineFitChecker)
- Unit conversions: `convertToCm()`, `convertWeightToKg()`, `convertKgToLb()`

`src/lib/hooks.ts` — Shared hooks:
- `useFitMap(fitResults)` — converts `FitResult[]` to `Map<code, FitResult>`

### Airline Data Format

`public/data/airlines.json` — Each airline has:
```json
{
  "code": "RYR",
  "name": "Ryanair",
  "allowances": {
    "cabin": { "maxCm": [55, 40, 20], "maxKg": 10 },
    "checked": { "maxCm": [158], "maxKg": 20 }
  }
}
```

`maxCm` is either `[L, W, H]` (per-dimension) or `[total]` (sum limit). Fit logic sorts both arrays descending before comparing.

### Styling

- **Tailwind** with HSL CSS variables defined in `src/index.css` — see [design-system.md](guidelines/design-system.md)
- **Never use hardcoded colors** (`bg-white`, `text-red-500`) — always use CSS variable tokens (`bg-card`, `text-destructive`)
- Accent color: lime green `hsl(78 100% 62%)`
- Fonts: Space Grotesk (headings), Inter (body), IBM Plex Mono (mono)
- shadcn/ui components in `src/components/ui/` (New York style)

### Key Files

- `src/App.tsx` — Section composition + global snap config
- `src/lib/utils.ts` — `cn()`, `scrollToPinCenter()`
- `src/lib/fitLogic.ts` — Dimension comparison, unit conversion, fit checking
- `src/lib/hooks.ts` — Shared hooks (`useFitMap`)
- `src/lib/useSEO.ts` — Lightweight SEO hook (meta, OG, canonical, Twitter)
- `src/types/index.ts` — `Airline`, `FitResult`, `BagType`, `Dimensions`, `FitFilter`, etc.
- `src/store/appStore.ts` — Zustand store with localStorage persistence
- `src/sections/` — 3 sections: Hero (pinned), AirlinesBrowse, Footer (flowing)
- `src/components/` — AirlineSearch, InlineFitChecker, CompareTable, CheckYourBagPanel, AirlineDetailSheet, HeaderNav, etc.
- `src/pages/` — AirlinePage, AirlinesListPage (routes defined in main.tsx)

### Path Alias

`@` maps to `./src` (configured in vite.config.ts and tsconfig).

### File Size Target

Keep all files under 300 lines. Extract sub-components or utility functions when approaching this limit.
