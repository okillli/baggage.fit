import type { Dimensions, FitOutcome, Unit, WeightUnit } from '@/types';

/**
 * Convert dimensions from inches to centimeters
 */
export function convertToCm(dims: number[]): number[] {
  return dims.map(d => Math.round(d * 2.54 * 10) / 10);
}

/**
 * Convert dimensions from centimeters to inches
 */
export function convertToIn(dims: number[]): number[] {
  return dims.map(d => Math.round(d / 2.54 * 10) / 10);
}

/**
 * Check if maxCm is a total dimension sum (single value like [158]) vs per-dimension [L, W, H]
 */
export function isTotalDimensionLimit(dims: number[]): boolean {
  return dims.length === 1;
}

/**
 * Format dimensions for display with unit
 */
export function formatDimensions(dims: number[] | null, unit: Unit): string {
  if (!dims) return 'Unknown';
  if (isTotalDimensionLimit(dims)) {
    const displayVal = unit === 'in' ? convertToIn(dims)[0] : dims[0];
    return `${displayVal} ${unit} total (L+W+H)`;
  }
  const displayDims = unit === 'in' ? convertToIn(dims) : dims;
  return `${displayDims[0]} × ${displayDims[1]} × ${displayDims[2]} ${unit}`;
}

/**
 * Check if bag dimensions fit within airline limits
 * Handles both per-dimension [L, W, H] and total dimension sum [total] formats
 */
export function checkFit(
  userDims: number[],
  maxDims: number[] | null
): FitOutcome {
  if (!maxDims) return 'unknown';

  if (isTotalDimensionLimit(maxDims)) {
    // Compare sum of user dimensions against total limit
    const userTotal = calculateTotalDimension(userDims);
    return userTotal <= maxDims[0] ? 'fits' : 'doesnt-fit';
  }

  // Sort both descending for per-dimension comparison
  const userSorted = [...userDims].sort((a, b) => b - a);
  const maxSorted = [...maxDims].sort((a, b) => b - a);

  // Check if each dimension fits
  const fits = userSorted.every((dim, i) => dim <= (maxSorted[i] || 0));

  return fits ? 'fits' : 'doesnt-fit';
}

/**
 * Calculate a comparable size metric that works for both per-dimension and total limits
 * Returns total dimension sum (L+W+H) for consistent comparison
 */
export function calculateSizeMetric(dims: number[]): number {
  if (isTotalDimensionLimit(dims)) {
    return dims[0];
  }
  return dims.reduce((a, b) => a + b, 0);
}

/**
 * Calculate total dimension sum (L+W+H)
 */
export function calculateTotalDimension(dims: number[]): number {
  return dims.reduce((a, b) => a + b, 0);
}

/**
 * Get outcome display text
 */
export function getOutcomeText(outcome: FitOutcome): string {
  switch (outcome) {
    case 'fits':
      return 'Fits';
    case 'doesnt-fit':
      return "Doesn't fit";
    case 'unknown':
      return 'Unknown';
    default:
      return 'Unknown';
  }
}

/**
 * Get outcome color class for dark or light backgrounds
 */
export function getOutcomeColor(outcome: FitOutcome, variant: 'dark' | 'light' = 'dark'): string {
  if (variant === 'light') {
    switch (outcome) {
      case 'fits':
        return 'badge-fits';
      case 'doesnt-fit':
        return 'badge-doesnt-fit-light';
      case 'unknown':
        return 'badge-unknown-light';
      default:
        return 'badge-unknown-light';
    }
  }
  switch (outcome) {
    case 'fits':
      return 'badge-fits';
    case 'doesnt-fit':
      return 'badge-doesnt-fit';
    case 'unknown':
      return 'badge-unknown';
    default:
      return 'badge-unknown';
  }
}

/**
 * Parse dimension input value
 */
export function parseDimensionInput(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Validate dimensions
 */
export function validateDimensions(dims: Dimensions): boolean {
  return dims.l > 0 && dims.w > 0 && dims.h > 0;
}

/**
 * Check if user weight fits within airline weight limit
 */
export function checkWeightFit(
  userKg: number | null,
  maxKg: number | null
): FitOutcome {
  if (userKg === null || maxKg === null) return 'unknown';
  return userKg <= maxKg ? 'fits' : 'doesnt-fit';
}

/**
 * Combine dimension and weight outcomes into overall result.
 * doesnt-fit beats fits; unknown is neutral (doesn't worsen the result).
 */
export function combinedOutcome(
  dimOutcome: FitOutcome,
  weightOutcome: FitOutcome
): FitOutcome {
  if (dimOutcome === 'doesnt-fit' || weightOutcome === 'doesnt-fit') {
    return 'doesnt-fit';
  }
  if (dimOutcome === 'fits' && weightOutcome === 'fits') return 'fits';
  if (dimOutcome === 'fits' && weightOutcome === 'unknown') return 'fits';
  if (dimOutcome === 'unknown' && weightOutcome === 'fits') return 'fits';
  return 'unknown';
}

const KG_PER_LB = 0.453592;

/**
 * Convert weight to kilograms
 */
export function convertWeightToKg(weight: number, unit: WeightUnit): number {
  return unit === 'lb' ? Math.round(weight * KG_PER_LB * 100) / 100 : weight;
}

/**
 * Convert kilograms to pounds
 */
export function convertKgToLb(kg: number): number {
  return Math.round((kg / KG_PER_LB) * 10) / 10;
}

/**
 * Format weight for display in the user's preferred unit
 */
export function formatWeight(
  kg: number | null,
  unit: WeightUnit
): string {
  if (kg === null) return 'No limit';
  if (unit === 'lb') return `${convertKgToLb(kg)} lb`;
  return `${kg} kg`;
}
