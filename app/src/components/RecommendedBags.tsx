import { ExternalLink, ShoppingBag } from 'lucide-react';
import type { Airline, BagType } from '@/types';

/**
 * Affiliate-linked bag recommendations.
 *
 * AFFILIATE DISCLOSURE: Links marked with * are affiliate links.
 * baggage.fit may earn a commission if you purchase through these links,
 * at no extra cost to you. We only recommend bags that genuinely fit
 * the airline's published size limits.
 *
 * Affiliate programmes used:
 * - Cabin Max: 10% commission via cabinmax.com/pages/become-an-affiliate
 * - Amazon Associates: 3–5% commission on luggage category
 *
 * NOTE FOR ILIA: These are placeholder affiliate URLs.
 * Before going live, replace CABIN_MAX_AFFILIATE_TAG and AMAZON_AFFILIATE_TAG
 * with your actual tracking codes from each programme.
 * Cabin Max: sign up at cabinmax.com/pages/become-an-affiliate (or Adtraction)
 * Amazon: affiliate-program.amazon.com
 */

// Replace with your actual affiliate tracking codes
const CABIN_MAX_TAG = 'baggagefit-21'; // placeholder — replace with real Cabin Max code
const AMAZON_TAG = 'baggagefit-21';    // placeholder — replace with real Amazon Associates tag

interface BagProduct {
  id: string;
  name: string;
  brand: string;
  dimensions: [number, number, number]; // [L, W, H] in cm
  weight: number | null; // empty weight in kg
  description: string;
  affiliateUrl: string;
  source: 'cabin-max' | 'amazon';
  priceGbp?: number;
  priceEur?: number;
}

const BAG_CATALOG: BagProduct[] = [
  // UNDERSEAT / SMALL BAGS (fits Ryanair, Wizz, etc.)
  {
    id: 'cm-metz',
    name: 'Cabin Max Metz',
    brand: 'Cabin Max',
    dimensions: [40, 20, 25],
    weight: 0.4,
    description: 'The definitive budget airline underseat bag. Fits Ryanair, Wizz Air, Vueling & more free bag sizers.',
    affiliateUrl: `https://cabinmax.com/products/metz-40x20x25-cabin-bag?ref=${CABIN_MAX_TAG}`,
    source: 'cabin-max',
    priceGbp: 25,
  },
  {
    id: 'cm-aura',
    name: 'Cabin Max Aura',
    brand: 'Cabin Max',
    dimensions: [40, 30, 15],
    weight: 0.3,
    description: 'Ultra-slim underseat backpack, ideal for tight sizers and commuter flights.',
    affiliateUrl: `https://cabinmax.com/collections/cabin-bags?ref=${CABIN_MAX_TAG}`,
    source: 'cabin-max',
    priceGbp: 20,
  },
  // STANDARD CABIN BAGS (55×40×20 — most European standard)
  {
    id: 'cm-barcelona',
    name: 'Cabin Max Barcelona',
    brand: 'Cabin Max',
    dimensions: [55, 40, 20],
    weight: 1.4,
    description: 'Classic 55×40×20cm trolley bag. Compliant with Ryanair Priority, easyJet standard, and most European airlines.',
    affiliateUrl: `https://cabinmax.com/collections/cabin-cases?ref=${CABIN_MAX_TAG}`,
    source: 'cabin-max',
    priceGbp: 45,
  },
  {
    id: 'cm-atlas',
    name: 'Cabin Max Atlas',
    brand: 'Cabin Max',
    dimensions: [55, 40, 20],
    weight: 1.1,
    description: 'Lightweight cabin backpack (55×40×20cm). Fits overhead on priority fares. No wheels = extra packing space.',
    affiliateUrl: `https://cabinmax.com/collections/cabin-backpacks?ref=${CABIN_MAX_TAG}`,
    source: 'cabin-max',
    priceGbp: 35,
  },
  // LARGER CABIN BAGS (56×45×25 — BA, easyJet Plus, KLM)
  {
    id: 'amazon-56-45-25',
    name: 'Expandable Cabin Trolley 56×45×25cm',
    brand: 'Various',
    dimensions: [56, 45, 25],
    weight: 2.0,
    description: 'Fits British Airways, KLM, Air France, easyJet Plus and most full-service airline overhead limits.',
    affiliateUrl: `https://www.amazon.co.uk/s?k=cabin+bag+56x45x25+airline&tag=${AMAZON_TAG}`,
    source: 'amazon',
    priceGbp: 30,
  },
];

/**
 * Check if a bag fits within an allowance's maxCm constraint.
 * Uses same sorting logic as fitLogic.ts (sorts descending before comparing).
 */
function bagFitsAllowance(
  product: BagProduct,
  maxCm: number[] | null
): boolean {
  if (!maxCm) return true; // no dimension limit (weight only)
  const sortedProduct = [...product.dimensions].sort((a, b) => b - a);
  const sortedMax = [...maxCm].sort((a, b) => b - a);
  if (sortedMax.length === 1) {
    // Total dimension check
    const total = product.dimensions.reduce((a, b) => a + b, 0);
    return total <= sortedMax[0];
  }
  return sortedProduct.every((dim, i) => dim <= (sortedMax[i] ?? Infinity));
}

interface RecommendedBagsProps {
  airline: Airline;
  bagType: BagType;
  className?: string;
}

export function RecommendedBags({ airline, bagType, className }: RecommendedBagsProps) {
  const allowance = airline.allowances[bagType];
  if (!allowance) return null;

  // Filter bags that fit within the allowance
  const compatible = BAG_CATALOG.filter((bag) =>
    bagFitsAllowance(bag, allowance.maxCm)
  );

  if (compatible.length === 0) return null;

  const bagTypeLabel =
    bagType === 'cabin' ? 'Cabin Bags' :
    bagType === 'underseat' ? 'Underseat Bags' :
    'Bags';

  return (
    <section className={className} aria-label={`Recommended ${bagTypeLabel} for ${airline.name}`}>
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="w-4 h-4 text-accent" aria-hidden="true" />
        <h3 className="section-label">
          {bagTypeLabel} that fit {airline.name}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {compatible.slice(0, 4).map((bag) => (
          <a
            key={bag.id}
            href={bag.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-start gap-3 p-3 bg-secondary border border-border rounded-xl hover:border-accent/40 transition-colors"
            aria-label={`${bag.name} — ${bag.description} (affiliate link, opens in new tab)`}
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
              <ShoppingBag className="w-4 h-4 text-accent" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-heading font-bold text-sm group-hover:text-accent transition-colors">{bag.name}</p>
                {bag.priceGbp && (
                  <span className="text-xs text-muted-foreground font-mono">from £{bag.priceGbp}</span>
                )}
                {bag.source === 'cabin-max' && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent/80 font-mono">Cabin Max</span>
                )}
                {bag.source === 'amazon' && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">Amazon</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{bag.description}</p>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-accent/70">
                <span className="font-mono">{bag.dimensions[0]}×{bag.dimensions[1]}×{bag.dimensions[2]}cm</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Affiliate disclosure */}
      <p className="text-xs text-muted-foreground mt-3 italic">
        * Affiliate links — baggage.fit may earn a small commission if you purchase through these links, at no extra cost to you.
      </p>
    </section>
  );
}
