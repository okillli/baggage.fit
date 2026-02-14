# UI/UX Audit Report — baggage.fit

**Date:** 2026-02-12
**Audited by:** Claude (interface-design skill)
**App version:** Local dev (Vite + React 19)
**Viewports tested:** Desktop 1280x720, Mobile 375x812

---

## Methodology

This audit was conducted through:

- **Visual inspection** via Playwright across desktop and mobile viewports
- **Accessibility tree analysis** via browser snapshots
- **Interactive flow testing** — both primary user paths (Start checking, Browse airline limits)
- **Source code review** of all sections, components, store, styles, and GSAP configuration
- **Animation/scroll testing** — GSAP ScrollTrigger snap behavior across viewports

Screenshots captured at each stage are stored alongside this report.

---

## Executive Summary

baggage.fit has a strong visual identity and well-structured information architecture. The dark theme with lime accent is distinctive, typography hierarchy is clear, and the airline detail sheet is polished. However, **a critical scroll-snap bug makes the primary content (the airline comparison table) unreachable on both desktop and mobile**, which effectively breaks the app's core function. Beyond that, several medium-severity UX issues — misleading fit badges, dead links, and missing mobile features — should be addressed before launch.

**Issues found:** 15
**Critical:** 1 | **High:** 2 | **Medium:** 6 | **Low-Medium:** 4 | **Low:** 2

---

## Critical Issues

### 1. GSAP Snap Traps Users — Airline Table Unreachable

**Severity:** Critical
**Affects:** All users, both desktop and mobile
**Location:** `src/App.tsx:24-82`

The global scroll snap configuration snaps to the **top** of the AirlinesBrowse section. Once the user arrives at "BROWSE AIRLINES", the snap prevents scrolling **within** the section. The search bar, airline cards/table, filter chips, and "Showing N airlines" count are all below the fold and cannot be reached.

**What happens:**
1. User scrolls past BagTypePicker → snap lands at top of Airlines section
2. User tries to scroll down to see the table → snap pulls them back to the section top
3. The airline data (the entire point of the app) is hidden

**Root cause:** The `snapTo` callback only computes snap points for pinned section centers and the airlines element top. There is no mechanism to release snap once the user enters the flowing section, so scrolling within it is impossible.

**Verified on:** Desktop 1280x720, Mobile 375x812. On mobile the issue is worse because more content is pushed below the fold (filter chips + bag type tabs + region dropdown all stack vertically).

**Recommendation:** Once `value > lastEnd` and the user is in the flowing section territory, return `value` unchanged (free scroll) rather than snapping to `airlinesNorm`. The flowing sections should scroll naturally without snap interference.

---

## High Severity Issues

### 2. All Footer Links Are Dead

**Severity:** High
**Location:** `src/sections/Footer.tsx:42-59`

Every link in the footer — About, Data sources, Contact, Twitter, GitHub, Email — points to `href="#"`. For a tool that asks travelers to trust its baggage data, dead links immediately undermine credibility. Users clicking "Data sources" expect to see where the information comes from.

**Recommendation:** Either implement these pages/links or remove them entirely. A footer with fewer real links is better than one full of broken ones. At minimum, "Data sources" should link to something — even a paragraph explaining the data collection methodology.

---

### 3. Fit Badges Appear in Airline Detail Without User Input

**Severity:** High
**Affects:** First-time users who haven't entered dimensions
**Location:** Airline detail sheet (AirlineDetailSheet / AirlineDetailContent)

When opening any airline's detail sheet, fit badges ("Fits" / "Doesn't fit") appear immediately for all three bag types — even when the user has never entered their bag dimensions. The default store values (55x40x20 cm) are silently used.

**What's confusing:**
- The Under-Seat Bag card shows "Doesn't fit" for default cabin bag dimensions. This is technically correct but misleading — the user never said they're checking underseat fit with those dimensions.
- A user who just browsed to the detail sheet may trust these badges without realizing they're based on default (not their) values.

**Recommendation:** Either:
- Don't show fit badges in the detail sheet until the user has explicitly run "Check fit"
- Or clearly label the badges: "Based on 55x40x20 cm" so users understand the context

---

## Medium Severity Issues

### 4. Native `<select>` Elements Break the Design System

**Severity:** Medium
**Location:** `src/sections/AirlinesBrowse.tsx:133-143` (Sort), `AirlinesBrowse.tsx:226-235` (Region)

Two native `<select>` elements render OS-native dropdown menus that look inconsistent with the polished dark/lime design system. On mobile, these open the platform's native picker wheel, which is visually jarring in context.

**Recommendation:** Replace with Radix Select or a custom dropdown component that matches the design language. The existing bag type toggle buttons show the target aesthetic.

---

### 5. Mobile: Collapsed Panel Text Wraps Awkwardly

**Severity:** Medium
**Viewport:** 375px

At mobile width, the "Check your bag" collapsible trigger text wraps to:
```
Check your     23 fit, 18
bag            don't        ∨
```

The text is cramped, the hit target feels small, and the summary competes with the label for space.

**Recommendation:** On mobile, simplify the collapsed state. Consider stacking: label on one line, summary on a second line below. Or shorten to "Check bag" on mobile.

---

### 6. No Input Validation on Dimensions or Weight

**Severity:** Medium
**Location:** `src/components/CheckYourBagPanel.tsx`, DimensionInput, WeightInput

Users can enter `0`, negative numbers, or unreasonably large values (e.g., 9999 cm) and click "Check fit" without any feedback. The inputs accept any numeric value with no minimum, maximum, or error states.

**Recommendation:**
- Set `min={1}` on dimension inputs
- Show inline validation for unreasonable values (e.g., > 200 cm for cabin)
- Disable "Check fit" button when inputs are invalid

---

### 7. VisualSizer Component Hidden on Mobile

**Severity:** Medium
**Location:** `src/components/CheckYourBagPanel.tsx:118`

The VisualSizer (the bag-vs-limit size comparison diagram) has the class `hidden lg:flex`, making it completely invisible on screens below 1024px. This diagram is one of the most helpful visual elements — it shows your bag dimensions relative to the airline's maximum.

**Recommendation:** Show a simplified version on mobile. Even a horizontal bar chart comparing your bag's dimensions to the limit would be more useful than hiding the visualization entirely.

---

### 8. Bag Type Cards Have Redundant Accessible Names

**Severity:** Medium (Accessibility)
**Location:** BagTypePicker section

The bag type cards are `<button>` elements whose accessible names concatenate all child text: `"Cabin bag Cabin bag Carry-on that goes in the overhead."` — the name "Cabin bag" appears twice.

**Recommendation:** Add a proper `aria-label` to each button (e.g., `aria-label="Select cabin bag"`) to provide a clean screen reader experience.

---

### 9. Sort/Filter Dropdowns Missing Labels

**Severity:** Medium (Accessibility)
**Location:** `src/sections/AirlinesBrowse.tsx:133`, `AirlinesBrowse.tsx:226`

Both `<select>` elements have no `<label>` element or `aria-label`. Screen readers cannot communicate what these dropdowns control.

**Recommendation:** Add `aria-label="Sort airlines by"` and `aria-label="Filter by region"` respectively.

---

## Low-Medium Severity Issues

### 10. Abrupt Dark-to-Light Background Transition

**Severity:** Low-Medium

The transition from the dark pinned sections (`hsl(0, 0%, 10%)` + dot-grid) to the light AirlinesBrowse section (`#F2F2F2`) is a hard cut. The GSAP scroll exit animates content away, but the background switches instantly from near-black to near-white, which is jarring.

**Recommendation:** Add a gradient transition zone between sections, or fade the background as part of the scroll animation.

---

### 11. Heading `line-height: 0.95` Causes Tight Wrapping

**Severity:** Low-Medium
**Location:** `src/index.css:53`

All headings have `line-height: 0.95`. On mobile where "WILL YOUR BAG FIT?" wraps to multiple lines, descenders from letters like "g" in "BAG" can visually collide with ascenders on the next line.

**Recommendation:** Use a slightly more generous `line-height` for headings at small viewports (e.g., `line-height: 1.0` below `md` breakpoint).

---

### 12. Font Loading Strategy — Potential FOUT

**Severity:** Low-Medium
**Location:** `src/index.css:1`

Three web fonts (Space Grotesk, Inter, IBM Plex Mono) are loaded via Google Fonts with `display=swap`. On slower connections, this causes Flash of Unstyled Text. Since Space Grotesk is used for all headings with uppercase + tight letter-spacing, the layout shift during swap is noticeable.

**Recommendation:** Self-host the fonts with `font-display: optional` for a smoother experience, or add `<link rel="preload">` for the critical font files.

---

### 13. Hardcoded Color Breaks Token System

**Severity:** Low-Medium
**Location:** `src/sections/AirlinesBrowse.tsx:113`

The Airlines section uses `bg-[#F2F2F2]` — a hardcoded hex value that bypasses the CSS variable token system. Every other color in the app flows through HSL variables.

**Recommendation:** Add a `--surface-light` or similar token to the CSS variables and reference it via Tailwind config.

---

## Low Severity Issues

### 14. ScrollReveal in Airlines Section Adds Unnecessary Delay

**Severity:** Low
**Location:** `src/sections/AirlinesBrowse.tsx` (multiple `<ScrollReveal>` wrappers)

Every element in AirlinesBrowse is wrapped in `<ScrollReveal>` with staggered delays (0 → 0.05 → 0.1 → 0.15 → 0.2 → 0.3). When combined with the snap (which teleports users to this section), users see content appearing sequentially rather than being immediately available. The table — the most important element — has the longest delay.

**Recommendation:** Remove ScrollReveal from the Airlines section. Show all content immediately since users arrive via snap. ScrollReveal is better suited for long-form pages with natural scroll.

---

### 15. Footer "Check another bag" Returns to Hero Instead of BagTypePicker

**Severity:** Low
**Location:** `src/sections/Footer.tsx:9-12`

The "Check another bag" button scrolls back to the Hero section. Since a returning user already knows the product, it would be more useful to scroll directly to BagTypePicker (bag type selection), skipping the marketing hero.

---

## Design System Observations

### What Works Well

| Aspect | Assessment |
|--------|-----------|
| **Visual identity** | Strong and distinctive. Dark theme + lime accent is memorable and consistent |
| **Typography** | Clear hierarchy — Space Grotesk headings, Inter body, IBM Plex Mono labels |
| **Bag type picker** | Polished cards with good imagery and clear selection state |
| **Airline detail sheet** | Well-structured with clear info hierarchy, fit badges per bag type |
| **Fit results UX** | Fit column + filter chips (All/Fits/Doesn't fit) is cleanly implemented |
| **Mobile adaptation** | Cards instead of table on mobile — appropriate responsive strategy |
| **Token architecture** | CSS variables are well-organized through the design system |
| **Micro-interactions** | `btn-lift`, collapsible animations, entrance animations feel polished |

### What Could Improve

| Aspect | Observation |
|--------|-------------|
| **Color palette** | Entirely monochromatic (dark gray + lime). No warmth or travel-world connection |
| **Dot-grid background** | Very subtle (8% opacity, 24px) — adds visual noise without clear purpose |
| **Section contrast** | Dark-to-light transition needs smoother bridging |
| **Mobile density** | The stacking of filters, chips, and tabs takes up a full viewport before any airline data appears |
| **Empty states** | No empty state design for search with no results or filter combinations that return zero airlines |

---

## Priority Matrix

| Priority | Issue | Description | Effort |
|----------|-------|-------------|--------|
| **P0** | #1 | GSAP snap traps users — table unreachable | Medium |
| **P1** | #2 | Dead footer links | Low |
| **P1** | #3 | Misleading fit badges without user input | Medium |
| **P2** | #4 | Native select elements | Medium |
| **P2** | #5 | Mobile panel text wrapping | Low |
| **P2** | #6 | No input validation | Low |
| **P2** | #7 | VisualSizer hidden on mobile | Medium |
| **P2** | #8 | Bag type card accessible names | Low |
| **P2** | #9 | Dropdown missing labels | Low |
| **P3** | #10 | Dark-to-light transition | Medium |
| **P3** | #11 | Heading line-height clipping | Low |
| **P3** | #12 | Font loading FOUT | Medium |
| **P3** | #13 | Hardcoded color token | Low |
| **P3** | #14 | ScrollReveal delays in Airlines | Low |
| **P3** | #15 | Footer CTA destination | Low |

---

## Appendix: Screenshots

| Screenshot | Description |
|-----------|-------------|
| `audit-01-hero.png` | Desktop hero section — initial load |
| `audit-03-scrolled.png` | Desktop BagTypePicker section |
| `audit-04-airlines-browse.png` | Desktop AirlinesBrowse section top |
| `audit-05-footer.png` | Desktop footer |
| `audit-06-airline-detail-sheet.png` | Airline detail sheet (British Airways) |
| `audit-07-check-panel-open.png` | CheckYourBagPanel expanded with VisualSizer |
| `audit-08-fit-results-table.png` | Fit results with panel open |
| `audit-10-collapsed-fit-table.png` | Collapsed panel — snap locks to section top |
| `audit-12-mobile-hero.png` | Mobile hero (375px) |
| `audit-13-mobile-bagtype.png` | Mobile bag type picker |
| `audit-14-mobile-airlines.png` | Mobile airlines section — snap locks here |
