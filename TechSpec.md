# baggage.fit — Technical Specification

## 1. Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| Button | CTAs, actions | Lime accent variant, sharp corners |
| Input | Dimension inputs, search | Dark theme, lime focus ring |
| Card | Result cards, type cards | Custom dark variant with border |
| Badge | Outcome badges (Fits/Doesn't/Unknown) | Lime/red/gray variants |
| Chip | Airline selection chips | Custom selectable chips |
| Toggle | cm/in unit toggle | Custom styling |
| Tabs | Bag type selector | Custom underline animation |
| Select | Sort dropdown | Dark theme |
| ScrollArea | Results list scrolling | Custom scrollbar |
| Separator | Dividers | Low opacity white |

### Custom Components
| Component | Purpose | Location |
|-----------|---------|----------|
| DotGridBackground | Shared background pattern | `components/DotGridBackground.tsx` |
| HeaderNav | Top navigation | `components/HeaderNav.tsx` |
| MobileTabBar | Floating bottom pill | `components/MobileTabBar.tsx` |
| UnitToggle | cm/inch toggle with animation | `components/UnitToggle.tsx` |
| DimensionInput | L×W×H input group | `components/DimensionInput.tsx` |
| AirlineMultiSelect | Searchable chip selector | `components/AirlineMultiSelect.tsx` |
| BagTypeCard | Selectable bag type card | `components/BagTypeCard.tsx` |
| FitResultCard | Result display card | `components/FitResultCard.tsx` |
| VisualSizer | Bag vs sizer diagram | `components/VisualSizer.tsx` |
| CompareTable | Airline ranking table | `components/CompareTable.tsx` |
| OutcomeBadge | Fits/Doesn't/Unknown badge | `components/OutcomeBadge.tsx` |
| ScrollReveal | Reusable scroll animation wrapper | `components/ScrollReveal.tsx` |

### Section Components
| Section | File | Pin Status |
|---------|------|------------|
| Hero | `sections/Hero.tsx` | Pinned |
| BagTypePicker | `sections/BagTypePicker.tsx` | Pinned |
| DimensionsInput | `sections/DimensionsInput.tsx` | Pinned |
| AirlineSelector | `sections/AirlineSelector.tsx` | Pinned |
| ResultsDashboard | `sections/ResultsDashboard.tsx` | Flowing |
| CompareMode | `sections/CompareMode.tsx` | Flowing |
| PolicyDeepDive | `sections/PolicyDeepDive.tsx` | Flowing |
| Footer | `sections/Footer.tsx` | Flowing |

---

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero auto-play entrance | GSAP | Timeline on mount, staggered reveals | Medium |
| Hero exit scroll | GSAP ScrollTrigger | Scrubbed x/opacity transforms | Medium |
| Bag type cards entrance | GSAP ScrollTrigger | Staggered from left/center/right | High |
| Bag type cards exit | GSAP ScrollTrigger | Divergent exit motion | Medium |
| Dimensions panel slide | GSAP ScrollTrigger | Left/right panel convergence | Medium |
| Bag block scale in | GSAP | back.out easing | Low |
| Airline chips stagger | GSAP ScrollTrigger | Staggered y/opacity | Medium |
| Search field scaleX | GSAP ScrollTrigger | scaleX transform | Low |
| Results cards reveal | GSAP ScrollTrigger | Staggered with slight rotate | Medium |
| Compare table rows | GSAP ScrollTrigger | Staggered y reveal | Low |
| Bag-into-sizer scroll | GSAP ScrollTrigger | Scrubbed position animation | High |
| Button hover lift | CSS | transform transition | Low |
| Card hover effects | CSS | transform + border transition | Low |
| Chip selection | CSS + React | State-driven class toggle | Low |
| Tab underline | CSS/Framer | layoutId or width animation | Medium |
| Unit toggle spring | Framer Motion | layout animation | Low |
| Global scroll snap | GSAP ScrollTrigger | Derived snap targets | High |

### Animation Library Choices

**GSAP + ScrollTrigger** (Primary)
- All pinned section animations
- Scroll-driven scrubbed animations
- Global snap implementation
- Complex timelines with fromTo()

**Framer Motion** (Secondary)
- Component-level micro-interactions
- Layout animations (tab underline, unit toggle)
- AnimatePresence for mount/unmount

**CSS Transitions** (Simple interactions)
- Hover states
- Focus rings
- Simple transforms

---

## 3. Animation Library Choices

### GSAP + ScrollTrigger (Primary)
**Rationale**: Best for pinned sections, scrubbed animations, and global snap.

**Usage**:
- Pinned sections with `pin: true`, `scrub: 0.5`
- ScrollTrigger timelines with `fromTo()` for reverse scroll
- Global snap derived from pinned ranges

### Framer Motion (Secondary)
**Rationale**: Excellent for React component animations and layout transitions.

**Usage**:
- Tab underline with `layoutId`
- Unit toggle spring animation
- AnimatePresence for conditional rendering

### CSS Animations (Simple states)
**Rationale**: Performance-optimal for hover/focus states.

**Usage**:
- Button hover `translateY(-2px)`
- Card hover border glow
- Focus ring transitions

---

## 4. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── bag_cabin.jpg
│   │   ├── bag_underseat.jpg
│   │   └── bag_checked.jpg
│   └── data/
│       └── airlines.json
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── DotGridBackground.tsx
│   │   ├── HeaderNav.tsx
│   │   ├── MobileTabBar.tsx
│   │   ├── UnitToggle.tsx
│   │   ├── DimensionInput.tsx
│   │   ├── AirlineMultiSelect.tsx
│   │   ├── BagTypeCard.tsx
│   │   ├── FitResultCard.tsx
│   │   ├── VisualSizer.tsx
│   │   ├── CompareTable.tsx
│   │   ├── OutcomeBadge.tsx
│   │   └── ScrollReveal.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── BagTypePicker.tsx
│   │   ├── DimensionsInput.tsx
│   │   ├── AirlineSelector.tsx
│   │   ├── ResultsDashboard.tsx
│   │   ├── CompareMode.tsx
│   │   ├── PolicyDeepDive.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useScrollAnimation.ts
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── fitLogic.ts
│   │   └── animations.ts
│   ├── types/
│   │   └── index.ts
│   ├── store/
│   │   └── appStore.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Dependencies

### Core
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  }
}
```

### Animation
```json
{
  "dependencies": {
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.0",
    "framer-motion": "^11.0.0"
  }
}
```

### UI Components
```json
{
  "dependencies": {
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0"
  }
}
```

### State Management
```json
{
  "dependencies": {
    "zustand": "^4.4.7"
  }
}
```

### Fonts
- Google Fonts: `Space Grotesk`, `Inter`, `IBM Plex Mono`

---

## 6. Data Model

### Airline Schema (TypeScript)
```typescript
interface Airline {
  code: string;           // IATA code (e.g., "RYR")
  name: string;           // Full name (e.g., "Ryanair")
  country: string;        // ISO country code
  links: {
    policy: string;       // Official baggage policy URL
    calculator?: string;  // Optional size calculator URL
  };
  lastVerified: string;   // ISO date (YYYY-MM-DD)
  allowances: {
    cabin?: BagAllowance;
    underseat?: BagAllowance;
    checked?: BagAllowance;
  };
}

interface BagAllowance {
  maxCm: [number, number, number] | null;  // [L, W, H] or null if unknown
  maxKg: number | null;                    // Weight limit or null
  notes?: string;                          // Additional info
}
```

### App State (Zustand)
```typescript
interface AppState {
  // User inputs
  bagType: 'cabin' | 'underseat' | 'checked';
  dimensions: { l: number; w: number; h: number };
  unit: 'cm' | 'in';
  selectedAirlines: string[];  // Airline codes
  
  // Results
  results: FitResult[];
  
  // UI state
  currentView: 'hero' | 'check' | 'compare' | 'airline';
  selectedAirlineDetail: string | null;
  
  // Actions
  setBagType: (type: BagType) => void;
  setDimensions: (dims: Dimensions) => void;
  setUnit: (unit: Unit) => void;
  toggleAirline: (code: string) => void;
  checkFit: () => void;
  clearResults: () => void;
}
```

### Fit Result Schema
```typescript
type FitOutcome = 'fits' | 'doesnt-fit' | 'unknown';

interface FitResult {
  airline: Airline;
  outcome: FitOutcome;
  bagType: BagType;
  userDimensions: number[];  // [L, W, H] in cm
  maxDimensions: number[] | null;
  volumeDiff?: number;       // Percentage difference
}
```

---

## 7. Fit Logic Algorithm

```typescript
function checkFit(
  userDims: number[],  // [L, W, H] in cm
  maxDims: number[] | null,
  bagType: BagType
): FitOutcome {
  if (!maxDims) return 'unknown';
  
  // Sort both descending for comparison
  const userSorted = [...userDims].sort((a, b) => b - a);
  const maxSorted = [...maxDims].sort((a, b) => b - a);
  
  // Check if each dimension fits
  const fits = userSorted.every((dim, i) => dim <= maxSorted[i]);
  
  return fits ? 'fits' : 'doesnt-fit';
}

function convertToCm(dims: number[], unit: 'cm' | 'in'): number[] {
  if (unit === 'cm') return dims;
  return dims.map(d => Math.round(d * 2.54 * 10) / 10);
}
```

---

## 8. Scroll Snap Implementation

```typescript
// Global snap configuration for GSAP ScrollTrigger
function createGlobalSnap() {
  const pinned = ScrollTrigger.getAll()
    .filter(st => st.vars.pin)
    .sort((a, b) => a.start - b.start);
  
  const maxScroll = ScrollTrigger.maxScroll(window);
  if (!maxScroll || pinned.length === 0) return;
  
  const pinnedRanges = pinned.map(st => ({
    start: st.start / maxScroll,
    end: (st.end ?? st.start) / maxScroll,
    center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
  }));
  
  ScrollTrigger.create({
    snap: {
      snapTo: (value: number) => {
        const inPinned = pinnedRanges.some(
          r => value >= r.start - 0.02 && value <= r.end + 0.02
        );
        if (!inPinned) return value;
        
        const target = pinnedRanges.reduce(
          (closest, r) =>
            Math.abs(r.center - value) < Math.abs(closest - value)
              ? r.center
              : closest,
          pinnedRanges[0]?.center ?? 0
        );
        return target;
      },
      duration: { min: 0.15, max: 0.35 },
      delay: 0,
      ease: 'power2.out',
    },
  });
}
```

---

## 9. Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
};

// Animation distance adjustments
const getAnimationDistance = (isMobile: boolean) => ({
  entrance: isMobile ? '40vw' : '60vw',
  exit: isMobile ? '40vw' : '70vw',
  vertical: isMobile ? '30vh' : '60vh',
});
```

---

## 10. Performance Optimizations

1. **will-change**: Apply to animated elements before animation
2. **GPU acceleration**: Use transform3d for all movement
3. **Lazy loading**: Images loaded with loading="lazy"
4. **Code splitting**: Routes split with React.lazy
5. **Reduced motion**: Respect prefers-reduced-motion
6. **Debounce**: Resize handlers debounced at 100ms
7. **Passive listeners**: Scroll events use passive: true

---

## 11. Accessibility Requirements

1. **Keyboard navigation**: All interactive elements focusable
2. **ARIA labels**: Proper labels for inputs and buttons
3. **Focus indicators**: Visible focus rings (lime)
4. **Reduced motion**: Disable animations when preferred
5. **Color contrast**: WCAG AA compliance (4.5:1 minimum)
6. **Screen reader**: Results announced with live regions

---

## 12. Build Configuration

### Vite Config
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['gsap', '@gsap/react', 'framer-motion'],
        },
      },
    },
  },
});
```

### Tailwind Config Extensions
```javascript
// Colors
colors: {
  background: '#1A1A1A',
  'background-light': '#F2F2F2',
  accent: '#D7FF3B',
  'text-primary': '#F6F6F6',
  'text-secondary': '#B7B7B7',
}

// Fonts
fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
}
```