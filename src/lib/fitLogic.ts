import type { Dimensions, FitOutcome, Unit } from '@/types';

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
 * Get outcome color class
 */
export function getOutcomeColor(outcome: FitOutcome): string {
  switch (outcome) {
    case 'fits':
      return 'bg-accent text-background';
    case 'doesnt-fit':
      return 'bg-transparent border-2 border-red-500 text-white';
    case 'unknown':
      return 'bg-transparent border-2 border-white/30 text-white/70';
    default:
      return 'bg-transparent border-2 border-white/30 text-white/70';
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
