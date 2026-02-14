/**
 * Convert a 2-letter ISO country code to its flag emoji.
 */
export function countryToFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(
    ...code.split('').map((c) => c.charCodeAt(0) + 0x1F1A5)
  );
}

export const CURRENT_YEAR = new Date().getFullYear();
