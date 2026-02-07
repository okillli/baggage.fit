import type { Airline } from '@/types';

export function airlineToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function findAirlineBySlug(
  airlines: Airline[],
  slug: string
): Airline | undefined {
  return airlines.find((a) => airlineToSlug(a.name) === slug);
}
