# Accessibility Guidelines — baggage.fit

## Heading Hierarchy

- Each page gets ONE `<h1>` (set by the page/section, not duplicated)
- Within detail views (sheets, modals, pages): use `<h2>` for sub-sections, never skip to `<h3>`
- SheetTitle / DialogTitle counts as the heading for overlays

## ARIA Patterns

### Live Regions
- Any content that updates dynamically (fit results, search counts, status messages) MUST have `aria-live="polite" aria-atomic="true"`
- Place the `aria-live` on the CONTAINER, not on individual items

### Decorative Icons
- Icons next to text labels: `aria-hidden="true"` on the icon
- Icon-only buttons: `aria-label` on the button (NOT on the icon)

### Form Groups
- Related controls (bag type selector, unit toggles): wrap in a container with `role="group" aria-label="..."`
- Radio-style toggles: use `role="radiogroup"` + `role="radio"` + `aria-checked`

### Combobox / Search
- Search inputs: `aria-describedby` pointing to a hidden hint with keyboard navigation instructions
- Dropdown results: `role="listbox"` with `role="option"` items + `aria-activedescendant`

### Tables
- All `<th>` elements MUST have `scope="col"` or `scope="row"`
- Use `<caption>` or `aria-label` on the `<table>` element

## Color and Contrast

- NEVER rely on color alone to convey meaning — always pair with text or icons
- Use semantic CSS variables (`text-destructive`, `bg-accent`) not raw colors (`text-red-500`, `bg-green-50`)
- Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text

## Reduced Motion

- All GSAP animations: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- When reduced motion is preferred: set `duration: 0` (not just shorter)
- CSS transitions: use `@media (prefers-reduced-motion: reduce)` to disable

## Focus Management

- Sheet/modal open: focus moves to the first focusable element inside
- Sheet/modal close: focus returns to the trigger element
- Skip link: `<a href="#main-content" className="skip-link">Skip to content</a>` at top of page

## Keyboard Navigation

- All interactive elements must be reachable via Tab
- Custom dropdowns: Arrow keys to navigate, Enter to select, Escape to close
- Radix primitives handle most of this — do NOT override their keyboard handling
