# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Architecture

### Scroll System (GSAP ScrollTrigger + ScrollToPlugin)

The app is built around a **pinned scroll** pattern. Four sections are pinned to the viewport with GSAP ScrollTrigger (`pin: true, scrub`), stacked by z-index so each "covers" the previous:

```
Hero (z-10) → BagTypePicker (z-20) → DimensionsInput (z-30) → AirlineSelector (z-40)
```

Each pinned section has ~120% scroll height. Entrance animations play during the first ~25% of the pin range; the section then stays visible for the remaining scroll. The next section covers it via higher z-index.

After the pinned sections, **flowing sections** (ResultsDashboard, CompareMode, Footer) scroll normally at z-50.

**Global snap** (`App.tsx`): A single `ScrollTrigger.create({ snap })` snaps to the center of each pinned section's scroll range. Free scroll is allowed past the last pin for flowing content.

**Stale snap end fix**: The snap callback derives `snapEnd = scrollY / value` instead of relying on the snap trigger's internal `end`, which can go stale when async content (airline data) changes page height.

### Programmatic Scroll Navigation

- **Pinned sections**: Use `scrollToPinCenter(sectionId)` from `src/lib/utils.ts`. It calculates the pin-spacer center and uses GSAP ScrollToPlugin to animate there. Since the target equals the snap center, snap agrees with the final position.
- **Flowing sections**: Use `gsap.to(window, { scrollTo: '#section-id' })` directly.
- **Never use native `behavior: 'smooth'`** — it competes with the GSAP snap system. GSAP ScrollToPlugin tweens do not compete (snap waits for them to finish).

### State Management (Zustand)

`src/store/appStore.ts` — Single Zustand store holding:
- User inputs: `bagType`, `dimensions`, `unit`, `selectedAirlines`
- Data: `airlines[]` (fetched once from `/data/airlines.json`), `airlinesLoading`
- Results: `results[]` (computed fit outcomes)
- UI: `currentView`, `compareSort`, `compareBagType`

Key action: `checkFit()` compares user dimensions against airline limits. Handles two formats: per-dimension `[L, W, H]` and total-dimension `[158]`.

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

- **Tailwind** with HSL CSS variables defined in `src/index.css`
- Accent color: lime green `hsl(78 100% 62%)`
- Fonts: Space Grotesk (headings), Inter (body), IBM Plex Mono (mono)
- `.section-pinned` — full viewport, `bg-background` (prevents peek-through between pins)
- `.section-flowing` — normal flow
- shadcn/ui components in `src/components/ui/` (New York style)

### Key Files

- `src/App.tsx` — Section composition + global snap config
- `src/lib/utils.ts` — `cn()`, `scrollToPinCenter()`
- `src/lib/fitLogic.ts` — Dimension comparison, unit conversion, formatting
- `src/types/index.ts` — `Airline`, `FitResult`, `BagType`, `Dimensions`, etc.
- `src/store/appStore.ts` — Zustand store
- `src/sections/` — 7 section components (4 pinned, 3 flowing)
- `src/components/` — Shared components (HeaderNav, FitResultCard, CompareTable, VisualSizer, etc.)

### Path Alias

`@` maps to `./src` (configured in vite.config.ts and tsconfig).
