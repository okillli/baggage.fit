# Design System Guidelines — baggage.fit

## CSS Variables (Design Tokens)

ALL colors must use the HSL CSS variables defined in `src/index.css`. Never use hardcoded Tailwind colors.

### Do / Don't

| Don't | Do |
|---|---|
| `bg-white`, `bg-gray-900` | `bg-card` or `bg-background` |
| `text-red-500` | `text-destructive` |
| `bg-green-50` | `bg-accent/10` |
| `bg-red-50` | `bg-destructive/10` |
| `border-red-500` | `border-destructive` |
| `border-white/30` | `border-foreground/30` |
| `text-gray-400` | `text-muted-foreground` |
| `text-white` | `text-foreground` |

### Token Reference

```
--background     → page background
--foreground     → primary text
--card           → card/dropdown surface
--card-foreground → text on cards
--accent         → lime green highlight
--accent-foreground → text on accent
--destructive    → red/error
--muted          → subtle backgrounds
--muted-foreground → secondary text
--border         → default borders
--ring           → focus rings
```

## Input Styling

- Background: `bg-card`
- Border: `border border-border`
- Focus: `input-focus` utility class (applies `ring-2 ring-ring` on focus-visible)
- Transition: add `transition-colors` for hover/focus states
- Consistent padding: `px-3 py-2` for standard inputs

## Badge Tokens

Badges in `index.css` use class-based token mapping:
- `.badge-fits` → accent border/bg
- `.badge-doesnt-fit` → destructive border/bg
- `.badge-unchecked` → foreground/30 border

Do NOT add inline color classes to badges — modify the CSS classes instead.

## Typography

- Headings: `font-heading` (Space Grotesk)
- Body: default (Inter)
- Mono/data: `font-mono` (IBM Plex Mono)
- Section labels: `.section-label` class (uppercase, tracking-widest, muted-foreground)

## Spacing Consistency

- Panel padding: `px-6 pb-6 pt-6` (not mixed px-5/pb-5)
- Card padding: `p-4` or `p-6`
- Section gaps: `gap-4` or `gap-6`
- Don't mix spacing scales within the same component

## Scrollbar & Selection

Scrollbar and text selection colors use CSS variables, NOT hardcoded RGBA:
```css
scrollbar-color: hsl(var(--muted) / 0.15) transparent;
::selection { background: hsl(var(--accent) / 0.3); }
```

## Component Patterns

- Use Radix UI primitives for accessible overlays (Sheet, Dialog, Collapsible)
- shadcn/ui components live in `src/components/ui/` — prefer these over custom implementations
- Keep all component files under 300 lines
