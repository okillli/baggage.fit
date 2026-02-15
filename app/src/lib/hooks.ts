import { useMemo } from 'react';
import type { FitResult } from '@/types';

/** Build a code → FitResult map. Shared by CompareTable + AirlinesBrowse. */
export function useFitMap(fitResults: FitResult[] | undefined) {
  return useMemo(() => {
    if (!fitResults?.length) return null;
    const map = new Map<string, FitResult>();
    for (const r of fitResults) map.set(r.airline.code, r);
    return map;
  }, [fitResults]);
}
