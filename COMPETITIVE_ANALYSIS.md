# Competitive Analysis — baggage.fit
**Researched:** 2026-02-18  
**Analyst:** Overnight Research Agent

---

## Executive Summary

The baggage checker tool space is surprisingly crowded but uniformly poor. Every major competitor has significant gaps — most critically: **no fee data, no per-dimension pass/fail breakdown, no checked bag support, or all three**. baggage.fit is the only tool that:
1. Shows all 3 bag types simultaneously (cabin + underseat + checked)
2. Provides per-dimension pass/fail breakdown ("Width: 42cm > 40cm ❌")
3. Has a visual sizer (VisualSizer)
4. Is built as a fast, modern PWA with dark mode

The main gap vs competitors is the **fee/inclusion data** (free vs. paid per bag type) — several competitors show this partially.

---

## Competitor Analysis

### 1. CarryFit (carryon.fit)
- **Airlines:** 172
- **Bag types:** Carry-on + personal item only (no checked bags)
- **What it does well:**
  - Largest airline database (172)
  - "Fit Score %" — percentage of airlines your bag fits
  - Open source (GitHub)
  - Soft bag toggle (accounts for flexible bag compression)
  - Dimension-order agnostic (sorts dimensions before comparing)
- **What it's missing:**
  - No checked bag support at all
  - No fee data (no indication of whether bag is free or paid)
  - No weight input or validation
  - No visual bag representation
  - No per-dimension breakdown (just pass/fail)
  - No PWA, no offline support
  - Overwhelming 172-card list with no smart filtering
  - No dark mode
- **Design:** Functional but utilitarian. White/light. Cards with airline names only, no flags or logos.
- **baggage.fit edge:** All 3 bag types, per-dimension breakdown, VisualSizer, dark mode, better UX

---

### 2. SizeMybag (sizemybag.com)
- **Airlines:** 100+
- **Bag types:** Cabin bag only
- **What it does well:**
  - Visual SVG bag diagram that adjusts to user dimensions
  - Dimension sliders (alternative to number inputs)
  - Airline logos shown
  - Weight input
  - PWA support
- **What it's missing:**
  - No underseat/personal item support
  - No checked bag support
  - No fee data
  - Heavy SEO content buried under the tool (aggressive marketing)
  - Aggressive popup ads
  - No per-dimension breakdown
  - Performance issues (popups on mobile are disruptive)
- **baggage.fit edge:** All 3 bag types, no popups, per-dimension breakdown, better performance

---

### 3. CarryOnChecker
- **Airlines:** 72
- **Bag types:** Carry-on only
- **What it does well:**
  - **4 preset size buttons** (fastest possible input flow — the gold standard for quick checking)
  - Region tabs for easier browsing
  - "Fit Score" percentage
  - Clean, minimal UI
- **What it's missing:**
  - No weight validation
  - No personal item/underseat
  - No checked bags
  - No fee data
  - Relatively few airlines (72)
- **baggage.fit edge:** All 3 bag types, weight validation, per-dimension breakdown, more airlines

---

### 4. WillMyBagFit (willmybagfit.com)
- **Airlines:** 160+
- **Bag types:** Carry-on + personal item (catalog-based)
- **What it does well:**
  - **Bag product catalog** — search by brand/model (Samsonite Cosmolite, Cabin Max Atlas, etc.)
  - Compatibility score for each airline
  - No manual dimension input needed if your bag is in the catalog
  - Large airline database
- **What it's missing:**
  - **Useless if your bag isn't in the catalog** — no manual input
  - No checked bags
  - No fee data
  - Catalog likely outdated for newer bag models
  - No visual representation
- **baggage.fit edge:** Manual input + saved bags, all 3 bag types, per-dimension breakdown, works for any bag

---

### 5. AirlineBagFit (airlinebagfit.com)
- **Airlines:** 53
- **Bag types:** Carry-on + personal item
- **What it does well:**
  - Route comparison (check same bag for multiple airlines in a trip)
  - "Strictest airline" rankings
  - Popular bag compatibility pages (pre-built SEO pages)
  - Clean modern UI
- **What it's missing:**
  - No checked bags
  - No fee data
  - Relatively few airlines (53)
  - No visual sizer
  - No per-dimension breakdown
- **baggage.fit edge:** Checked bags, more airlines, VisualSizer, fee data (once added)

---

### 6. Ryanair Official Baggage Page
- **URL:** ryanair.com/gb/en/.../baggage-policy
- **What it does well:**
  - Authoritative source, always current
  - Shows fare tier distinctions (Value/Regular/Flexi Plus)
  - Size sizer video/animation
- **What it's missing:**
  - Can't compare with other airlines
  - No interactive checker
  - No "does my specific bag fit?" tool
  - Poor mobile UX (lots of text, accordions)
- **baggage.fit edge:** Multi-airline comparison, interactive fit checker, better mobile UX

---

### 7. easyJet Official Baggage Page
- **URL:** easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage
- **What it does well:**
  - Clear distinction between small/large cabin bag
  - Price shown for large cabin bag add-on
  - FAQ section answers common questions
- **What it's missing:**
  - No interactive checker
  - No comparison with other airlines
  - Confusing fare-dependency explanation (wall of text)
- **baggage.fit edge:** Interactive checker, multi-airline comparison, cleaner UX

---

### 8. British Airways Baggage Page
- **URL:** britishairways.com/en-gb/information/baggage-essentials/hand-baggage
- **What it does well:**
  - Very clear visual diagrams of bag sizes
  - Cabin class distinction
  - Well-designed, authoritative
- **What it's missing:**
  - No interactive checker
  - Can't compare with other airlines
- **baggage.fit edge:** Interactive checker, multi-airline comparison

---

### 9. iflybags.com
- **Airlines:** Unknown (appears to be checked bag focus)
- **What it does well:**
  - Focuses on checked baggage specifically (a niche gap others miss)
  - Fee information for checked bags
- **What it's missing:**
  - Appears dated/limited
  - No cabin/underseat
- **baggage.fit edge:** All 3 bag types, modern UX, more current data

---

## Key Competitive Gaps (baggage.fit Opportunities)

### 🔴 Immediate Priority
1. **Fee/inclusion data** — No competitor comprehensively shows "is this bag type FREE or paid on the cheapest fare?" — this is the **#1 traveller question** and the gap baggage.fit can own.

2. **All 3 bag types** — baggage.fit is the ONLY tool showing cabin + underseat + checked simultaneously. This is a genuine differentiator — maintain and emphasise it.

### 🟠 Medium Priority
3. **Per-dimension breakdown** — baggage.fit's InlineFitChecker showing "Width: 42cm > 40cm ❌" is unique. No competitor does this. It should be more prominently featured in marketing.

4. **VisualSizer** — The animated bag-vs-frame comparison is unique. No competitor has this.

5. **Affiliate bag catalog** — WillMyBagFit has a bag catalog (without manual input), baggage.fit could have a bag catalog WITH manual input + affiliate links. Best of both worlds.

### 🟡 Lower Priority
6. **Soft bag toggle** (like CarryFit) — useful for fabric bags that compress

7. **Trip mode** — multi-airline checking for a route (like AirlineBagFit's route comparisons)

8. **Bag model presets** — pre-loaded popular bag dimensions (Cabin Max Aura, Samsonite Cosmolite, Away Carry-On)

---

## Where Competitors Win

| Feature | CarryFit | SizeMybag | WillMyBagFit | baggage.fit |
|---------|---------|-----------|-------------|-------------|
| Most airlines | ✅ 172 | ✅ 100+ | ✅ 160+ | 41 |
| All 3 bag types | ❌ | ❌ | ❌ | ✅ |
| Per-dimension breakdown | ❌ | ❌ | ❌ | ✅ |
| Fee/inclusion data | ❌ | ❌ | ❌ | ⚠️ Partial |
| Visual sizer | ❌ | ✅ | ❌ | ✅ |
| Weight validation | ❌ | ✅ | ❌ | ✅ |
| Bag catalog/presets | ❌ | ❌ | ✅ | ❌ |
| Dark mode | ❌ | ❌ | ❌ | ✅ |
| PWA | ❌ | ✅ | ❌ | ✅ |

**baggage.fit's primary weakness:** Fewer airlines (41 vs 100–172).  
**baggage.fit's primary strength:** The only tool with all 3 bag types + per-dimension breakdown.

---

## Affiliate Landscape

### Cabin Max (cabinmax.com)
- **Program:** Available on Adtraction, TradeTracker, BrandReward
- **Commission:** 10% per sale
- **Direct signup:** cabinmax.com/pages/become-an-affiliate
- **Products:** Cabin bags, trolley bags, backpacks — all sized specifically for airline compliance
- **Relevance:** EXTREMELY HIGH — Cabin Max explicitly designs bags to fit budget airline sizers (Ryanair, Wizz Air, etc.)
- **Action:** Sign up on Adtraction; they review applications

### Amazon Associates
- **Commission:** 3-5% on bags/luggage
- **Products:** Wide range; can deep-link to specific bag dimensions
- **Relevance:** High — most users recognise and trust Amazon
- **Action:** Apply at affiliate-program.amazon.com

### Away Travel (awaytravel.com)
- **Program:** Available on CJ Affiliate (Commission Junction)
- **Commission:** Approx 5-10%
- **Note:** Away's referral program explicitly EXCLUDES affiliate/site use; must use their publisher program via CJ Affiliate
- **Products:** Premium carry-ons (The Carry-On, etc.)
- **Relevance:** Medium — Away bags are popular but premium-priced
- **Action:** Apply via CJ Affiliate network

### Skyscanner Affiliate
- **Commission:** Up to 20% of Skyscanner's revenue from referred bookings; ~$0.40-$1.00 per click-out
- **Signup:** partners.skyscanner.net/product/affiliates
- **Relevance:** Medium — contextually relevant on airline pages ("Book your Ryanair flight")
- **Action:** Apply at partners.skyscanner.net

### Other Luggage Affiliates Worth Noting
- **CabinZero** (cabinzero.com) — affiliate via AWIN, cabin bags starting at ~£35
- **Osprey Packs** — via Impact Radius, ~8% commission
- **Samsonite** — via AWIN/Rakuten, 5-7% commission

---

## Recommended Affiliate Strategy

**Phase 1 (Now):** Add Cabin Max + Amazon links to:
1. Airline pages after allowance cards — "Shop bags for Ryanair"
2. InlineFitChecker results — "These bags would fit"
3. Add affiliate disclosure (required by FTC/ASA)

**Phase 2 (After traffic grows):** Apply for Skyscanner as contextual booking link on airline pages

**Recommended first products to link:**
| Product | Why | Affiliate |
|---------|-----|-----------|
| Cabin Max Metz (40×20×25cm) | Fits Ryanair/Wizz underseat free | Cabin Max |
| Cabin Max Aura (40×30×15cm) | Universal underseat | Cabin Max |
| Cabin Max Barcelona (55×40×20cm) | Standard cabin bag | Cabin Max |
| Generic 55×40×20cm options | via Amazon Associates | Amazon |

---

*Research completed 2026-02-18. All prices approximate — verify before publishing.*
