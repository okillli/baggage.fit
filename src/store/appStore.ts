import { create } from 'zustand';
import type { AppState, Airline, BagType, Dimensions, FitResult, FitOutcome, Unit } from '@/types';
import { isTotalDimensionLimit, calculateTotalDimension } from '@/lib/fitLogic';

export const POPULAR_AIRLINE_CODES = ['RYR', 'EZY', 'BAW', 'DLH', 'KLM', 'DAL', 'UAL', 'UAE', 'QTR', 'SIA'];

const initialDimensions: Dimensions = {
  l: 55,
  w: 40,
  h: 20,
};

export const useAppStore = create<AppState>((set, get) => ({
  // User inputs
  bagType: 'cabin',
  dimensions: { ...initialDimensions },
  unit: 'cm',
  selectedAirlines: [],

  // Centralized airline data
  airlines: [],
  airlinesLoading: true,

  // Results
  results: [],

  // UI state
  currentView: 'hero',
  selectedAirlineDetail: null,
  compareSort: 'largest',
  compareBagType: 'cabin',

  // Actions
  loadAirlines: async () => {
    // Only fetch once
    if (get().airlines.length > 0) return;
    try {
      const res = await fetch('/data/airlines.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Airline[] = await res.json();
      set({ airlines: data, airlinesLoading: false });
    } catch (err) {
      console.error('Failed to load airlines:', err);
      set({ airlinesLoading: false });
    }
  },

  setBagType: (type: BagType) => set({ bagType: type, results: [] }),

  setDimensions: (dims: Partial<Dimensions>) =>
    set((state) => ({
      dimensions: { ...state.dimensions, ...dims },
      results: [],
    })),

  setUnit: (unit: Unit) => set({ unit, results: [] }),

  toggleAirline: (code: string) =>
    set((state) => {
      const isSelected = state.selectedAirlines.includes(code);
      if (isSelected) {
        return {
          selectedAirlines: state.selectedAirlines.filter((c) => c !== code),
          results: [],
        };
      }
      return {
        selectedAirlines: [...state.selectedAirlines, code],
        results: [],
      };
    }),

  selectAllPopularAirlines: () =>
    set({ selectedAirlines: [...POPULAR_AIRLINE_CODES], results: [] }),

  clearSelectedAirlines: () => set({ selectedAirlines: [], results: [] }),

  checkFit: (airlines) => {
    const { dimensions, unit, bagType } = get();

    // Convert to cm if needed
    const userDims = unit === 'in'
      ? [dimensions.l, dimensions.w, dimensions.h].map(d => Math.round(d * 2.54 * 10) / 10)
      : [dimensions.l, dimensions.w, dimensions.h];

    const results: FitResult[] = airlines
      .filter((a) => get().selectedAirlines.includes(a.code))
      .map((airline) => {
        const allowance = airline.allowances[bagType];
        const maxDims = allowance?.maxCm || null;

        let outcome: FitOutcome = 'unknown';
        let volumeDiff: number | undefined;

        if (maxDims) {
          if (isTotalDimensionLimit(maxDims)) {
            // Total dimension sum comparison (e.g., [158] = L+W+H <= 158)
            const userTotal = calculateTotalDimension(userDims);
            outcome = userTotal <= maxDims[0] ? 'fits' : 'doesnt-fit';
            volumeDiff = Math.round(((userTotal - maxDims[0]) / maxDims[0]) * 100);
          } else {
            // Per-dimension comparison
            const userSorted = [...userDims].sort((a, b) => b - a);
            const maxSorted = [...maxDims].sort((a, b) => b - a);

            const fits = userSorted.every((dim, i) => dim <= (maxSorted[i] || 0));
            outcome = fits ? 'fits' : 'doesnt-fit';

            // Calculate volume difference
            const userVol = userDims.reduce((a, b) => a * b, 1);
            const maxVol = maxDims.reduce((a, b) => a * b, 1);
            volumeDiff = Math.round(((userVol - maxVol) / maxVol) * 100);
          }
        }

        return {
          airline,
          outcome,
          bagType,
          userDimensions: userDims,
          maxDimensions: maxDims,
          volumeDiff,
        };
      });

    set({ results });
  },

  clearResults: () => set({ results: [] }),

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedAirlineDetail: (code) => set({ selectedAirlineDetail: code }),

  setCompareSort: (sort) => set({ compareSort: sort }),

  setCompareBagType: (type) => set({ compareBagType: type }),
}));
