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

The app uses a **browse-first** layout with **2 pinned + 2 flowing** sections:

```
Hero (pinned, z-10) → BagTypePicker (pinned, z-20) → AirlinesBrowse (flowing) → Footer (flowing)
```

Each pinned section has ~130% scroll height with entrance/exit animations driven by scrub. The next section covers the previous via higher z-index.

After the pinned sections, **flowing sections** (AirlinesBrowse, Footer) scroll normally.

**Global snap** (`App.tsx`): A single `ScrollTrigger.create({ snap })` snaps to the center of each pinned section's scroll range. Free scroll is allowed past the last pin for flowing content.

**Stale snap end fix**: The snap callback derives `snapEnd = scrollY / value` instead of relying on the snap trigger's internal `end`, which can go stale when async content (airline data) changes page height.

### Browse-First UX

- **Hero** has dual CTA: "Start checking" (opens bag panel + scrolls to BagType) and "Browse airline limits" (scrolls straight to AirlinesBrowse)
- **BagTypePicker** → "Next: browse airlines" scrolls to AirlinesBrowse with check panel open
- **AirlinesBrowse** is the main destination: airline table + collapsible `CheckYourBagPanel` for optional dimension/weight entry
- Fit badges appear inline in the CompareTable after the user checks their bag
- Fit filter chips (All / Fits / Doesn't fit) appear when results exist

### Programmatic Scroll Navigation

- **Pinned sections**: Use `scrollToPinCenter(sectionId)` from `src/lib/utils.ts`.
- **Flowing sections**: Use `gsap.to(window, { scrollTo: '#section-id' })` directly.
- **Never use native `behavior: 'smooth'`** — it competes with the GSAP snap system.

### State Management (Zustand)

`src/store/appStore.ts` — Single Zustand store holding:
- User inputs: `bagType`, `dimensions`, `unit`, `weight`, `weightUnit`
- Data: `airlines[]` (fetched once from `/data/airlines.json`), `airlinesLoading`
- Results: `results[]` (computed fit outcomes)
- UI: `currentView` (`'hero' | 'browse'`), `compareSort`, `checkPanelOpen`

Key action: `checkFit(airlines)` compares user dimensions against ALL passed airlines. Handles two formats: per-dimension `[L, W, H]` and total-dimension `[158]`.

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
- `src/types/index.ts` — `Airline`, `FitResult`, `BagType`, `Dimensions`, `FitFilter`, etc.
- `src/store/appStore.ts` — Zustand store
- `src/sections/` — 4 sections: Hero, BagTypePicker (pinned), AirlinesBrowse, Footer (flowing)
- `src/components/` — CheckYourBagPanel, CompareTable, OutcomeBadge, HeaderNav, VisualSizer, etc.

### Path Alias

`@` maps to `./src` (configured in vite.config.ts and tsconfig).
