# baggage.fit — Comprehensive Redesign Plan

## Executive Summary

Based on deep research across 8 competitor tools, UX best practices, real traveler behavior data, and modern UI patterns, this plan proposes a redesign centered on **two key insights**:

1. **Most users already know their airline** — they want to search "Ryanair" and instantly see all baggage rules
2. **Travelers carry multiple bags** — they need to see underseat + cabin + checked as a complete picture, with what's free vs paid

---

## Research Findings

### Competitive Analysis (8 tools analyzed)

| Tool | Airlines | Bag Types | Strengths | Weaknesses |
|------|----------|-----------|-----------|------------|
| **CarryFit** (carryon.fit) | 172 | Carry-on + Personal | Soft bag toggle, dimension-order agnostic, open source | No presets, no weight validation, overwhelming 172-card list |
| **CarryOnChecker** | 72 | Carry-on only | **4 preset size buttons** (fastest path), region tabs, Fit Score % | No weight, no personal item, generic design |
| **SizeMyBag** | 42 | Carry-on only | **Visual SVG bag**, sliders, PWA, airline logos, weight input | Only 42 airlines, buried under SEO content, aggressive popups |
| **WillMyBagFit** | 160+ | Carry-on + Personal | **Per-dimension comparison** (your vs max), roller vs backpack toggle | Too many clicks (5 to answer), bland design |
| **WillMyBag.fit** | ~100 | Carry-on | **Bag product catalog** — search by brand/model, no manual input | Useless if your bag isn't in catalog |
| **AirlineBagFit** | 53 | Carry-on + Personal | **Route comparisons**, strictest-airline rankings, popular bag compatibility pages | Only 53 airlines, single-airline-at-a-time |
| **SkyTeam Calculator** | ~18 | Carry-on | **Multi-carrier trip**, **cabin class aware** | Only alliance airlines, no dimension input |
| **CheckedBaggageSize** | ~100 | Checked only | Only checked-bag resource | Dead since 2018, most cells empty |

**What NOBODY does yet (our opportunities):**
1. Combined carry-on + personal item + checked in one tool
2. Weight input that actually validates compliance
3. Fare class / ticket tier awareness
4. Saved bag dimensions (measure once, compare forever)
5. "Which dimension is over?" per-dimension visual breakdown
6. Fee/price integration with size checking
7. Trip-based multi-airline checking

### User Journey Research

**When travelers check baggage rules (ranked by frequency):**
1. **After booking** — "I just booked Ryanair, what can I bring?" (most common)
2. **Before booking** — comparing airlines by bag generosity (budget travelers)
3. **Night before flying** — last-minute panic check (high urgency)
4. **Luggage shopping** — "Will this bag fit most airlines?" (less common)

**What confuses travelers most:**
1. Budget airlines advertising low fares but carry-on is a paid add-on (Ryanair Value = underseat only)
2. Same bag called different names (Ryanair "small bag" = easyJet "small cabin bag" = Delta "personal item")
3. Fare-dependent rules (Lufthansa Economy Light = no checked bag; Economy Classic = 1x23kg)
4. Automated gate scanners in 2025-2026 that don't negotiate — wheels/handles now measured
5. Domestic vs international differences on same airline

**Key mental model finding:** Dimensions matter MORE than fees to experienced travelers. A $300 bag that avoids two €60 Ryanair gate fees pays for itself immediately. Getting dimensions right prevents unexpected gate fees.

### UX Best Practices

**Search-first is the dominant pattern for 2025-2026:**
- Google, Raycast, Linear all follow "search first, browse second"
- Instant-as-you-type results (no "Search" button needed)
- Pre-populated suggestions for popular items
- Zero-click answers in the search dropdown itself

**Comparison tool architecture (NNGroup, Baymard, Smashing Magazine):**
- Sticky column headers are mandatory for any table longer than one screen
- "Highlight Differences" toggle (Best Buy pattern) — users toggle to see only what differs
- Cards on mobile, tables on desktop — hybrid approach
- Limit progressive disclosure to 2 levels max (summary → expanded, never a third level)

**Mobile-first for data-heavy tools:**
- Bottom sheets for detail views (maintain context with main content visible)
- Stacked cards > horizontal-scroll tables on mobile
- Skeleton loading reduces perceived wait by 40%
- Sticky action bar at bottom for primary CTA

**Persistence without accounts:**
- localStorage for bag dimensions (pre-fill on return visits)
- URL params for shareable state (`?bag=55x35x23&type=cabin`)
- "Recently viewed" airlines as quick-access chips
- No account required — localStorage + URL params covers all needs

---

## Proposed Architecture

### Three User Paths

```
┌──────────────────────────────────────────────────────────────┐
│                         HERO                                  │
│                                                               │
│             "WILL YOUR BAG FIT?"                              │
│                                                               │
│  ┌──────────────────────────────────────────┐                │
│  │ 🔍 Search airline (e.g. "Ryanair")       │  ← PRIMARY    │
│  └──────────────────────────────────────────┘                │
│                                                               │
│  Popular: [Ryanair] [easyJet] [Delta] [Wizz Air] [BA]       │
│                                                               │
│  ────── or ──────                                             │
│                                                               │
│  [Check your bag →]          [Browse all airlines →]         │
└──────────────────────────────────────────────────────────────┘
```

**Path A — Airline-first (primary, ~70% of users):**
Search or click airline → Airline Detail Page showing ALL bag types + inline fit checker

**Path B — Bag-first (secondary, ~20% of users):**
"Check your bag" → Enter dimensions → See fit results across all airlines (current browse experience)

**Path C — Browse (exploratory, ~10% of users):**
"Browse all" → Full comparison table with all airlines and all bag types

### Route Structure

| Route | Purpose | SEO Value |
|-------|---------|-----------|
| `/` | Hero + search + browse table below | High — landing page |
| `/airlines/:slug` | **Primary destination** — full airline baggage detail + inline fit checker | Very high — one per airline |
| `/airlines` | Browse/compare all airlines | High — directory |
| `/check` | Bag-first checker (enter dims → see all airlines) | Medium — utility |

---

## Phase 1: Core UX Restructure

### 1.1 — Search-First Hero

**Remove:** Pinned BagTypePicker section entirely (it's redundant and confusing)

**New Hero layout:**
- Large headline: "WILL YOUR BAG FIT?"
- Subheading: "Check baggage size and weight limits for 40+ airlines"
- **Airline search combobox** (the primary action):
  - Large, prominent, centered
  - Fuzzy search by airline name, IATA code, or country
  - Instant results as you type (no button)
  - Each result shows: flag + airline name + code
  - Selecting an airline → navigates to `/airlines/:slug`
  - **Zero-click answer in dropdown**: Show key dimensions inline (e.g., "Cabin: 55×40×20, 10kg")
- **Popular airline chips** below search (top 5-8 most searched):
  - Quick-tap buttons: `[Ryanair] [easyJet] [Delta] [Wizz Air] [BA]`
  - One tap → straight to airline detail page
- **Secondary CTAs** below:
  - "Check if your bag fits" → scrolls to AirlinesBrowse section (opens check panel)
  - "Browse all airlines" → scrolls to AirlinesBrowse section

**Scroll behavior:** Hero → AirlinesBrowse → Footer (only 2 sections, no pinned BagTypePicker)

### 1.2 — Airline Search Component

New `AirlineSearch` component:
- Built with Radix Combobox or cmdk pattern
- Fuzzy search (Fuse.js or similar lightweight library)
- Keyboard navigable (arrow keys, Enter to select, Escape to close)
- Shows results as you type (debounced)
- Reusable in: Hero, HeaderNav, airline detail page ("Compare with..." link)
- Each result item shows:
  - Country flag emoji
  - Airline name (bold match highlight)
  - IATA code (dimmed)
  - Key dimension summary (e.g., "Cabin: 55×40×20")

### 1.3 — Enhanced Airline Detail Page (`/airlines/:slug`)

This becomes the **primary destination** — everything a traveler needs on one page:

```
┌─────────────────────────────────────────────────────────────┐
│  Home / Airlines / Ryanair                                   │
│                                                              │
│  🇮🇪 Ryanair (RYR)                                          │
│  Low-cost carrier · Ireland · Last verified: 2026-01-15      │
│                                                              │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │  UNDERSEAT      │ │  CABIN BAG     │ │  CHECKED       │  │
│  │  (Personal)     │ │  (Carry-on)    │ │  (Hold)        │  │
│  │                 │ │                │ │                │  │
│  │  40 × 25 × 20  │ │  55 × 40 × 20 │ │  81 × 119 × 119│  │
│  │  No weight limit│ │  10 kg         │ │  20 kg         │  │
│  │                 │ │                │ │                │  │
│  │  ✅ INCLUDED    │ │  💰 From €6    │ │  💰 From €13   │  │
│  │  Free with all  │ │  Priority/Plus │ │  Online price   │  │
│  │  fare types     │ │  fares include │ │  varies by route│  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│                                                              │
│  ── CHECK YOUR BAG ──────────────────────────────────────   │
│  (collapsible, remembers last state)                         │
│                                                              │
│  Select bag type: [Cabin bag ▼]                             │
│  L [  ] × W [  ] × H [  ]  cm/in toggle                    │
│  Weight: [  ]  kg/lb toggle                                  │
│  [Check fit]                                                 │
│                                                              │
│  ── or use a saved bag ──                                    │
│  [My carry-on (55×35×23, 8kg)]  [+ Save current]           │
│                                                              │
│  RESULT:                                                     │
│  ✅ Your cabin bag FITS                                      │
│  Height: 55 ≤ 55 ✓  Width: 35 ≤ 40 ✓  Depth: 23 ≤ 20 ✗   │
│  Weight: 8kg ≤ 10kg ✓                                        │
│                                                              │
│  ── OFFICIAL LINKS ──                                        │
│  📋 Ryanair baggage policy ↗                                │
│  📋 Ryanair size calculator ↗                               │
│                                                              │
│  ── COMPARE ──                                               │
│  Search another airline: [_____________]                     │
│  ← Back to all airlines                                      │
└─────────────────────────────────────────────────────────────┘
```

**Key features:**
- All 3 bag types visible simultaneously as cards
- "Included" vs "Paid" badges on each card (green/amber/red)
- Inline fit checker (collapsible, not on a separate page)
- Per-dimension pass/fail with visual highlighting (which dimension is over)
- Saved bags from localStorage for quick re-checking
- Notes/caveats shown per bag type
- Official policy links for trust

### 1.4 — Simplified AirlinesBrowse Section

**Remove:** Bag type toggle buttons (no more switching between cabin/underseat/checked)
**Add:** All 3 bag types visible in the comparison table simultaneously

**New CompareTable columns:**

Desktop:
```
| Airline        | Underseat      | Cabin bag      | Checked        | Fit |
|----------------|----------------|----------------|----------------|-----|
| 🇮🇪 Ryanair    | 40×25×20 FREE  | 55×40×20 €6+   | 20kg €13+      | ✅  |
| 🇬🇧 easyJet    | 45×36×20 FREE  | 56×45×25 €6+   | 23kg €7+       | ✗   |
```

Mobile (stacked cards):
```
┌───────────────────────────────────┐
│ 🇮🇪 Ryanair                  [✅] │
│ Underseat: 40×25×20  FREE       │
│ Cabin:     55×40×20  From €6    │
│ Checked:   20 kg     From €13   │
└───────────────────────────────────┘
```

**Other changes:**
- Airline search/filter at top of section
- Region filter kept
- Sort options kept (largest, strictest, alphabetical)
- Click any airline row → navigates to `/airlines/:slug` (no more bottom sheet)
- CheckYourBagPanel stays collapsible at top for bag-first flow

### 1.5 — GSAP & Navigation Simplification

**Before:** Hero (pinned) → BagTypePicker (pinned) → AirlinesBrowse (flowing) → Footer
**After:** Hero (static or pinned) → AirlinesBrowse (flowing) → Footer

- Remove BagTypePicker from snap config entirely
- Simplify to 1 pinned section or make Hero static (non-pinned)
- Consider removing GSAP scroll entirely for simplicity — the app becomes more of a search tool than a scroll experience
- Keep GSAP animations for individual component transitions (hero entrance, card reveals)

### 1.6 — Persistent Dimensions (localStorage)

**Immediately impactful, zero complexity:**
- When a user enters dimensions in CheckYourBagPanel, save to localStorage
- On return visits, pre-fill the form
- Show: "Welcome back — checking your 55×35×23cm bag"
- Also persist: unit (cm/in), weight unit (kg/lb), last viewed airline

**URL state sharing:**
- Encode bag dimensions in URL: `?bag=55x35x23&w=8kg&type=cabin`
- Users can share their specific check with friends/travel companions
- Bookmarkable

---

## Phase 2: Enhanced Data Model

### 2.1 — Add Fee/Inclusion Data

Extend `BagAllowance` type:
```typescript
export interface BagAllowance {
  maxCm: number[] | null;
  maxKg: number | null;
  notes?: string;
  // NEW fields
  included: boolean;           // free with base/cheapest fare?
  fee?: {
    min: number;               // cheapest price (online, advance)
    max: number;               // most expensive (at gate)
    currency: string;          // EUR, USD, GBP
  };
  quantity?: number;           // how many of this type allowed (default 1)
}
```

Update `airlines.json` for all 41 airlines with:
- Whether each bag type is included in base fare
- Fee ranges (researched per airline)
- Notes about fare-dependent inclusions

### 2.2 — Visual Inclusion Indicators

Three states per bag type card:
- **Included** (green) — "FREE" with checkmark, included in base fare
- **Paid add-on** (amber) — "From €X" with price tag icon
- **Not available** (red) — "Not allowed" with X icon (rare)

These appear on both the airline detail page cards and in the CompareTable.

### 2.3 — Bag Type Terminology Clarity

Address the #1 confusion for travelers — different names for the same bag:
- Show our canonical name + common alternatives in parentheses
- Underseat → "Underseat bag (personal item, small bag)"
- Cabin → "Cabin bag (carry-on, overhead bag)"
- Checked → "Checked bag (hold luggage)"

---

## Phase 3: Multi-Bag & Saved Bags

### 3.1 — "My Bags" with localStorage

```typescript
interface SavedBag {
  id: string;                  // nanoid
  name: string;                // "My Samsonite carry-on"
  dimensions: Dimensions;      // { l, w, h }
  weight: number | null;
  unit: Unit;
  weightUnit: WeightUnit;
  bagType: BagType;            // intended use (cabin/underseat/checked)
  createdAt: string;           // ISO date
}
```

- Save/load from localStorage via Zustand persist middleware
- "My Bags" section in CheckYourBagPanel — quick-select any saved bag
- "Save current dimensions" button after entering dimensions
- Popular bag presets: pre-loaded common luggage models
  - "Standard cabin (55×40×20cm)"
  - "Ryanair underseat (40×25×20cm)"
  - "Maximum US carry-on (56×36×23cm)"

### 3.2 — Multi-Bag Checking

Check multiple bags against one airline simultaneously:
- "I'm bringing both an underseat bag AND a cabin bag"
- Assign each saved bag to a bag type
- Show combined result:
  - "Underseat: 40×30×20 → ✅ Fits, FREE"
  - "Cabin: 55×40×20 → ✅ Fits, from €6"
  - "Total: Both bags allowed, cabin bag costs extra"

### 3.3 — Per-Dimension Failure Highlighting

When a bag doesn't fit, show EXACTLY which dimension is over and by how much:
```
Height: 55cm ≤ 55cm  ✅ (exact fit)
Width:  42cm > 40cm   ❌ (2cm over)
Depth:  20cm ≤ 20cm  ✅ (exact fit)
Weight: 8kg ≤ 10kg   ✅ (2kg under)
```

Color-code each dimension: green = pass, red = fail, amber = within 1cm (soft warning).

---

## Phase 4: Future Enhancements

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Fare tier selector per airline | High | High | P2 |
| Soft/flexible bag toggle | Medium | Low | P2 |
| Popular luggage brand database | Medium | Medium | P3 |
| Route-based multi-airline trip checker | High | High | P3 |
| "Share my results" social cards | Low | Low | P3 |
| PWA offline support | Medium | Medium | P3 |
| Dark mode | Medium | Low | P3 |
| Airline enforcement strictness notes | Medium | Medium | P3 |
| AR/camera bag measurement | High | Very High | P4 |

---

## Implementation Priorities (Phase 1 Breakdown)

### Step 1: Core Infrastructure (Day 1)
- Create `AirlineSearch` combobox component
- Add `fuse.js` or similar for fuzzy search
- Test search works with all 41 airlines

### Step 2: Hero Redesign (Day 1-2)
- Redesign Hero.tsx with search bar as primary CTA
- Add popular airline chips
- Remove `scrollToPinCenter('bag-type')` references
- Update secondary CTAs

### Step 3: Remove BagTypePicker (Day 2)
- Delete `BagTypePicker.tsx`
- Remove from App.tsx layout
- Simplify GSAP snap config (1 section or none)
- Update `appStore.ts` — remove bagType-centric flow

### Step 4: Enhance Airline Detail Page (Day 2-3)
- Expand `AirlineDetailContent` with all 3 bag types always visible
- Add inline fit checker (bag type selector + dimension inputs)
- Add per-dimension pass/fail display
- Make it the primary destination from search

### Step 5: Simplify AirlinesBrowse (Day 3)
- Remove bag type toggle buttons
- Update `CompareTable` to show all 3 bag types as columns
- Mobile: switch to stacked card layout
- Click row → navigate to `/airlines/:slug` (remove bottom sheet)

### Step 6: localStorage Persistence (Day 3)
- Save/restore dimensions, unit, weight in localStorage
- Pre-fill on return visits
- URL param encoding for shareable state

### Step 7: Navigation & Polish (Day 4)
- Add search to `HeaderNav`
- Update all internal links
- Remove unused components (`BagTypeCard`, etc.)
- Validate with Playwright

---

## Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/components/AirlineSearch.tsx` | Fuzzy search combobox (Radix + Fuse.js) |
| CREATE | `src/components/InlineFitChecker.tsx` | Dimension/weight inputs + per-dim results for airline detail |
| MODIFY | `src/sections/Hero.tsx` | Search-first layout, popular chips, simplified CTAs |
| DELETE | `src/sections/BagTypePicker.tsx` | No longer needed |
| DELETE | `src/components/BagTypeCard.tsx` | No longer needed (was used by BagTypePicker) |
| MODIFY | `src/App.tsx` | Remove BagTypePicker, simplify snap, update layout |
| MODIFY | `src/pages/AirlinePage.tsx` | Enhanced with inline fit checker |
| MODIFY | `src/components/AirlineDetailContent.tsx` | All 3 bag types always visible + fit checker |
| MODIFY | `src/sections/AirlinesBrowse.tsx` | Remove bag type toggle, add search, simplify |
| MODIFY | `src/components/CompareTable.tsx` | All 3 bag types as columns, mobile cards |
| MODIFY | `src/components/CheckYourBagPanel.tsx` | Simplify, add saved bags UI |
| MODIFY | `src/store/appStore.ts` | localStorage persistence, remove single-bagType focus |
| MODIFY | `src/types/index.ts` | Add SavedBag, extend BagAllowance (Phase 2) |
| MODIFY | `src/components/HeaderNav.tsx` | Add search in nav bar |
| MODIFY | `src/components/AirlineDetailSheet.tsx` | May remove (replaced by page navigation) |

---

## Success Metrics

After redesign, measure:
1. **Clicks to first answer**: Target ≤ 2 (search + select airline)
2. **All 3 bag types visible**: 100% of views show underseat + cabin + checked
3. **No duplicate controls**: Bag type selection exists in exactly ONE place per context
4. **Return visitor pre-fill**: Dimensions remembered from last visit
5. **Mobile card layout**: No horizontal scrolling on comparison table
