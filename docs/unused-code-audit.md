# Unused Code & Features Audit — baggage.fit

_Date: 2026-02-07_

## 1. `selectedAirlineDetail` (store state + action)

**Where**: `src/store/appStore.ts`
**What**: A `string | null` state field and `setSelectedAirlineDetail` action — defined, initialized to `null`, never read anywhere.

**Original intention**: An airline detail modal/drawer. When a user taps an airline in results or the compare table, it would open a deep-dive view showing the full policy, notes, official link, and the calculator URL.

**Recommendation**: **Implement** — high value. Users want to verify the data before they trust it.

---

## 2. `links.calculator` (airline data field + type)

**Where**: `src/types/index.ts` defines `calculator?: string`, but no airline in `airlines.json` actually populates it, and no component reads it.

**Original intention**: Some airlines have official online bag sizers/calculators. This field was meant to link directly to those tools.

**Recommendation**: **Implement inside the airline detail view.** Low effort once the detail modal exists.

---

## 3. `maxKg` / weight data (airline data field)

**Where**: Every airline's allowance in `airlines.json` has `maxKg: number | null`, and the type defines it. But no component ever reads or displays weight.

**Original intention**: Weight is half of baggage compliance. The data schema was designed to support weight checking.

**Recommendation**: **Implement** — high value. Single biggest missing feature.

---

## 4. `use-mobile` hook

**Where**: `src/hooks/use-mobile.ts` — viewport-width detection hook. Never imported anywhere.

**Original intention**: Responsive layout branching — showing different component variants on mobile vs desktop.

**Recommendation**: **Delete** — Tailwind breakpoints handle responsiveness already. Only re-add if JS-level component swapping is needed.

---

## 5. `src/components/ui/` directory (54 shadcn/ui components)

**Where**: 54 files in `src/components/ui/`. Zero imported by any actual app component.

**Original intention**: Project was scaffolded with shadcn/ui. Every component was instead built from scratch with custom Tailwind + GSAP.

**Recommendation**: **Delete all.** Re-add `dialog` and `sonner` individually if needed for airline detail modal and toast notifications.

---

## 6. 12 unused npm dependencies

| Package | Intended for | Keep? |
|---|---|---|
| `react-hook-form` | Form validation | No |
| `@hookform/resolvers` | Zod + form integration | No |
| `zod` | Schema validation | Maybe |
| `cmdk` | Command palette search | No |
| `date-fns` | Date formatting | Maybe |
| `embla-carousel-react` | Image carousels | No |
| `input-otp` | OTP input fields | No |
| `react-day-picker` | Calendar picker | No |
| `react-resizable-panels` | Resizable layouts | No |
| `recharts` | Data charts/graphs | Maybe |
| `vaul` | Drawer component | No |
| `sonner` | Toast notifications | Maybe |
| `next-themes` | Dark/light mode toggle | No |

**Recommendation**: Remove all. Re-add selectively when needed.

---

## 7. `.glow-accent` CSS class

**Where**: `src/index.css` — lime-colored box-shadow glow. Never referenced.

**Original intention**: Hover/focus effects on CTA buttons or selected cards.

**Recommendation**: Wire up on "Check fit" button hover, or delete.

---

## 8. `country` field (partially used)

**Where**: Every airline in `airlines.json` has a `country` ISO code. Used internally for region filtering in CompareMode, but never displayed to the user.

**Original intention**: Show a country flag or label next to the airline name.

**Recommendation**: **Implement** — low effort, display flag emoji next to airline names.

---

## Priority Summary

| Item | Action | Effort | Value |
|---|---|---|---|
| Weight checking (`maxKg`) | **Implement** | Medium | High |
| Airline detail view (`selectedAirlineDetail`) | **Implement** | Medium | High |
| `links.calculator` | **Implement** (inside detail view) | Low | Medium |
| Country flags | **Implement** | Low | Medium |
| Remove unused shadcn/ui + deps | **Delete** | Low | Hygiene |
| `use-mobile` hook | **Delete** | Trivial | Hygiene |
| `.glow-accent` | **Wire up or delete** | Trivial | Polish |
| Unused npm deps | **Remove** | Low | Hygiene |
