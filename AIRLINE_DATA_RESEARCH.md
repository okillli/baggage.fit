# Airline Data Research Log — fee + included fields
**Researched:** 2026-02-18  
**Purpose:** Add `included: boolean` and `fee: {min, max, currency}` to all 41 airlines  

## Field Definitions
- `included: boolean` — Does the CHEAPEST/BASE fare include this bag type FREE? true = yes, false = costs extra
- `fee: {min, max, currency}` — Range of fees to add this bag type (online min → gate/late max)
- Fees are approximate, route-dependent, and subject to change

---

## Budget Carriers (Cabin Bag NOT Included in Cheapest Fare)

### Ryanair (RYR) 🇮🇪
**Research:** Ryanair fees page, mybaggage.com, moneyguideireland.com, reddit.com
- **Underseat (40×25×20):** INCLUDED free with all fares (Value/Regular/Flexi Plus) ✅
- **Cabin (55×40×20):** NOT included on Value fare. Requires Priority & 2 Cabin Bags add-on OR Regular/Flexi Plus fare
  - Online in advance: from ~€6-€35 (depends on route/time)
  - At airport: ~€35-€40
  - Gate: €69.99 (oversized/non-compliant)
  - `included: false`, fee: min 6, max 40, currency: EUR
- **Checked:** NOT included. Online from €13, gate from €60-70
  - `included: false`, fee: min 13, max 70, currency: EUR

### easyJet (EZY) 🇬🇧
**Research:** easyjet.com/en/policy/cabin-bags-faqs, cabinmax.com, reddit
- **Underseat (45×36×20, small):** INCLUDED free with ALL fares ✅
- **Cabin (56×45×25, large):** NOT included on Standard fare. Included on Plus/Flexi fares.
  - Online in advance: from ~£6-£30 (varies by route)
  - At airport/gate: £48
  - `included: false`, fee: min 6, max 48, currency: GBP
- **Checked:** NOT included on Standard fare. From £7 online, £48 at airport.
  - `included: false`, fee: min 7, max 48, currency: GBP

### Wizz Air (WIZ) 🇭🇺
**Research:** wizzair.com, mybaggage.com/wizz-air, cabinzero.com, primark.com
- **Underseat (40×30×20):** INCLUDED free with ALL fares ✅
- **Cabin/Trolley (55×40×23):** NOT included. Requires WIZZ Priority add-on.
  - Online in advance: from ~€10-€58.80 (varies by route)
  - `included: false`, fee: min 10, max 59, currency: EUR
- **Checked:** NOT included in base fare. From ~€9 online.
  - `included: false`, fee: min 9, max 50, currency: EUR

### Norwegian (NAX) 🇳🇴
**Research:** norwegian.com/en/travel-info/baggage/hand-baggage/, sendmybag.com, upgradedpoints.com
- **Underseat (38×30×20):** INCLUDED free with ALL fares (LowFare/LowFare+/Flex) ✅
- **Cabin (55×40×23):** NOT included on LowFare. Included on LowFare+ and Flex.
  - Purchase online: from ~€6-€14 per leg (LowFare add-on)
  - `included: false`, fee: min 6, max 14, currency: EUR
- **Checked:** NOT included on LowFare or LowFare+. From ~€20 online on Flex.
  - `included: false`, fee: min 20, max 60, currency: EUR

### SAS (SAS) 🇸🇪
**Research:** flysas.com/en/help-and-contact/faq/baggage/can-i-bring-cabin-baggage-in-sas-go-light/, kayak.com
- **Underseat (40×30×15):** INCLUDED free with ALL fares including Go Light ✅
- **Cabin (55×40×23):** NOT included on Go Light (within Europe). Included on Go, Plus, Pro.
  - Online add-on: from ~€20-€30
  - `included: false`, fee: min 20, max 40, currency: EUR
- **Checked:** NOT included on Go Light. From ~€20 online.
  - `included: false`, fee: min 20, max 50, currency: EUR

### Finnair (FIN) 🇫🇮
**Research:** airwaysmag.com, battleface.com, loyaltylobby.com, reddit.com/r/Finland
- **Underseat:** INCLUDED on all fares (even Superlight) ✅
- **Cabin (56×45×25):** NOT included on Economy Light or Superlight. Included on Economy Classic/Flex.
  - Online add-on: from ~€25-€45
  - `included: false`, fee: min 25, max 45, currency: EUR
- **Checked:** NOT included on Economy Light/Superlight. From ~€25 online.
  - `included: false`, fee: min 25, max 60, currency: EUR

### Vueling (VLE) 🇪🇸
**Research:** cabinzero.com/vueling, tripatini.com, vueling.com/en/vueling-services/vueling-fares
- **Underseat (40×30×20):** INCLUDED free with all fares ✅
- **Cabin (55×40×20, large):** NOT included in Basic fare. Must purchase.
  - Online add-on: from ~€8-€25
  - `included: false`, fee: min 8, max 30, currency: EUR
- **Checked:** NOT included in Basic fare. From ~€20-€30 online.
  - `included: false`, fee: min 20, max 60, currency: EUR

### Aer Lingus (EIN) 🇮🇪
**Research:** upgradedpoints.com, sendmybag.com, stasher.com, radicalstorage.com
- **Underseat:** INCLUDED free with ALL fares ✅
- **Cabin (55×40×24):** NOT included on Hand Baggage Only / basic European fares. Included on Plus/Advantage/AerSpace and transatlantic.
  - Online add-on: from ~€12-€30
  - At gate: ~€45+
  - `included: false`, fee: min 12, max 45, currency: EUR
- **Checked:** NOT included on standard European fares. From ~€12 online.
  - `included: false`, fee: min 12, max 50, currency: EUR

---

## Legacy/Full-Service Carriers (Cabin Bag Included)

### British Airways (BAW) 🇬🇧
- Cabin: INCLUDED ✅ (all fares including Hand Baggage Only have cabin bag; HB Only excludes checked)
- Underseat: INCLUDED ✅
- Checked: INCLUDED on most fares; NOT on Hand Baggage Only. Fee from £35 add-on.
  - `included: false`, fee: min 35, max 80, currency: GBP (for HB Only fare)

### Lufthansa (DLH) 🇩🇪
- Cabin: INCLUDED on Classic/Flex ✅; NOT on Economy Light
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light. From ~€30-€80 online.
  - checked `included: false`, fee: min 30, max 80, currency: EUR

### KLM (KLM) 🇳🇱
- Cabin: INCLUDED on most fares ✅; some Economy Light may not include
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light. From ~€20-€50 online.
  - checked `included: false`, fee: min 20, max 50, currency: EUR

### Air France (AFR) 🇫🇷
- Similar to KLM (same Air France-KLM group)
- Cabin: INCLUDED ✅; NOT on Basic fare
- Underseat: INCLUDED ✅
- Checked: NOT included on Basic fare. From ~€20-€50 online.
  - checked `included: false`, fee: min 20, max 50, currency: EUR

### Delta Air Lines (DAL) 🇺🇸
- Cabin: INCLUDED ✅ (overhead bin, no weight limit)
- Underseat: INCLUDED ✅ (personal item)
- Checked: NOT included in Main Cabin economy. First bag ~$35, second $45.
  - checked `included: false`, fee: min 35, max 80, currency: USD

### United Airlines (UAL) 🇺🇸
- Cabin: INCLUDED ✅ (overhead bin, no weight limit)
- Underseat: INCLUDED ✅ (personal item)
- Checked: NOT included in Economy. First bag ~$40, second $50.
  - checked `included: false`, fee: min 40, max 100, currency: USD

### American Airlines (AAL) 🇺🇸
- Cabin: INCLUDED ✅ (overhead bin, no weight limit)
- Underseat: INCLUDED ✅ (personal item)
- Checked: NOT included in Main Cabin. First bag ~$35, second $45.
  - checked `included: false`, fee: min 35, max 80, currency: USD

### Southwest Airlines (SWA) 🇺🇸
- Cabin: INCLUDED ✅
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ — 2 free checked bags per person! Industry-leading policy.
  - checked `included: true` (unique among US carriers)

### Emirates (UAE) 🇦🇪
- Cabin: INCLUDED ✅ (7kg, both cabin + handbag)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most fares (Economy: 25-35kg depending on fare)

### Qatar Airways (QTR) 🇶🇦
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most fares (Economy: 23-30kg)

### Singapore Airlines (SIA) 🇸🇬
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most fares (varies by route and class)

### Cathay Pacific (CPA) 🇭🇰
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on Economy (varies by route)

### Japan Airlines (JAL) 🇯🇵
- Cabin: INCLUDED ✅ (10kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on International Economy (23kg 1 piece or by weight)

### All Nippon Airways (ANA) 🇯🇵
- Cabin: INCLUDED ✅ (10kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on International Economy (23kg)

### Qantas (QFA) 🇦🇺
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on Economy fares (23kg first bag); NOT on Basic Economy
  - checked `included: false`, fee: min 30, max 80, currency: AUD (for basic fares)

### Virgin Atlantic (VIR) 🇬🇧
- Cabin: INCLUDED ✅ (10kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light. From ~£35 online.
  - checked `included: false`, fee: min 35, max 75, currency: GBP

### Icelandair (ICE) 🇮🇸
- Cabin: INCLUDED ✅ (10kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Tern/Light fares. From ~€25 online.
  - checked `included: false`, fee: min 25, max 60, currency: EUR

### TAP Air Portugal (TAP) 🇵🇹
- Cabin: INCLUDED ✅ (8kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Discount/Basic fares. From ~€25 online.
  - checked `included: false`, fee: min 25, max 55, currency: EUR

### Iberia (IBE) 🇪🇸
- Cabin: INCLUDED ✅ (10kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Basic fare. From ~€20 online.
  - checked `included: false`, fee: min 20, max 50, currency: EUR

### Austrian Airlines (AUA) 🇦🇹
- Cabin: INCLUDED ✅ on Classic/Flex; NOT on Economy Light
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light. From ~€30 online.
  - checked `included: false`, fee: min 30, max 70, currency: EUR

### LOT Polish Airlines (LOT) 🇵🇱
- Cabin: INCLUDED ✅ (8kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light/Saver. From ~€20-€30 online.
  - checked `included: false`, fee: min 20, max 50, currency: EUR

### Turkish Airlines (THY) 🇹🇷
- Cabin: INCLUDED ✅ (8kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most routes (20kg Economy); not on Economy Promotion on some routes
  - checked `included: true` on most routes; fee not applicable on standard routes

### Etihad Airways (ETD) 🇦🇪
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Lite. From ~$30-€35 online.
  - checked `included: false`, fee: min 30, max 70, currency: USD

### Korean Air (KAL) 🇰🇷
- Cabin: INCLUDED ✅ (12kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on Economy (varies by route: 1-2 pieces at 23kg)

### Air New Zealand (ANZ) 🇳🇿
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Seat-only fares. From ~NZD/AUD 30 online.
  - checked `included: false`, fee: min 30, max 80, currency: NZD

### Brussels Airlines (BEL) 🇧🇪
- Cabin: INCLUDED ✅ (12kg)
- Underseat: INCLUDED ✅
- Checked: NOT included on Economy Light/Saver. From ~€30 online.
  - checked `included: false`, fee: min 30, max 70, currency: EUR

### Czech Airlines (CSA) 🇨🇿
- Cabin: INCLUDED ✅ (8kg) — Note: Czech Airlines (ČSA) services are limited/suspended as of 2025; verify current status
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most fares

### Malaysia Airlines (MAL) 🇲🇾
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ (30kg Economy)

### Thai Airways (THA) 🇹🇭
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ (30kg Economy)

### Philippine Airlines (PAL) 🇵🇭
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ on most routes (20-30kg Economy)

### Garuda Indonesia (GIA) 🇮🇩
- Cabin: INCLUDED ✅ (7kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ (30kg Economy)

### Air China (CCA) 🇨🇳
- Cabin: INCLUDED ✅ (5kg — very low limit)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ (23kg Economy, varies by route)

### China Eastern (CES) 🇨🇳
- Cabin: INCLUDED ✅ (8kg)
- Underseat: INCLUDED ✅
- Checked: INCLUDED ✅ (23kg Economy)

---

## Data Confidence Notes

| Airline | Confidence | Notes |
|---------|-----------|-------|
| Ryanair | HIGH | Very well documented |
| easyJet | HIGH | Official page + third party confirmed |
| Wizz Air | HIGH | Official page confirmed |
| Norwegian | MEDIUM | LowFare fee range is approximate |
| SAS | HIGH | Official FAQ confirmed |
| Finnair | HIGH | Multiple sources confirm |
| Vueling | MEDIUM | Fee range from third parties |
| Aer Lingus | MEDIUM | Fare types complex; transatlantic different |
| Czech Airlines | LOW | Airline status uncertain as of 2025 |
| All others | MEDIUM | Based on general policies; route-specific fees vary |

**Important:** All fees are approximate and vary by route, time of booking, and season. Users should always verify on airline's official site.
