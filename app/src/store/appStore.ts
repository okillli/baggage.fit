import { create } from 'zustand';
import type { AppState, Airline, BagType, Dimensions, FitResult, FitOutcome, Unit, WeightUnit } from '@/types';
import { isTotalDimensionLimit, calculateTotalDimension, checkWeightFit, combinedOutcome, convertWeightToKg, convertKgToLb, convertToCm, convertToIn } from '@/lib/fitLogic';

// --- localStorage persistence ---
const STORAGE_KEY = 'baggage-fit-prefs';
interface PersistedPrefs { dimensions: Dimensions; unit: Unit; weight: number | null; weightUnit: WeightUnit; bagType: BagType }
function loadPrefs(): Partial<PersistedPrefs> {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
function savePrefs(p: PersistedPrefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}
function persistState(s: AppState) {
  savePrefs({ dimensions: s.dimensions, unit: s.unit, weight: s.weight, weightUnit: s.weightUnit, bagType: s.bagType });
}

const defaultDimensions: Dimensions = { l: 55, w: 40, h: 20 };
const saved = loadPrefs();

export const useAppStore = create<AppState>((set, get) => ({
  // User inputs (restored from localStorage)
  bagType: saved.bagType ?? 'cabin',
  dimensions: saved.dimensions ?? { ...defaultDimensions },
  unit: saved.unit ?? 'cm',
  weight: saved.weight ?? null,
  weightUnit: saved.weightUnit ?? 'kg',

  // Centralized airline data
  airlines: [],
  airlinesLoading: true,
  airlinesError: null,

  // Results
  results: [],

  // UI state
  currentView: 'hero',
  selectedAirlineDetail: null,
  compareSort: 'largest',
  checkPanelOpen: false,

  // Actions
  loadAirlines: async () => {
    // Only fetch once (unless previous attempt errored)
    if (get().airlines.length > 0) return;
    set({ airlinesError: null, airlinesLoading: true });
    try {
      const res = await fetch('/data/airlines.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Airline[] = await res.json();
      set({ airlines: data, airlinesLoading: false });
    } catch (err) {
      console.error('Failed to load airlines:', err);
      set({ airlinesLoading: false, airlinesError: 'Failed to load airline data. Please try again.' });
    }
  },

  setBagType: (type: BagType) => {
    const state = get();
    set({ bagType: type });
    persistState(get());
    if (state.results.length > 0 && state.airlines.length > 0) {
      get().checkFit(state.airlines);
    } else {
      set({ results: [] });
    }
  },

  setDimensions: (dims: Partial<Dimensions>) => {
    set((state) => ({
      dimensions: { ...state.dimensions, ...dims },
      results: [],
    }));
    persistState(get());
  },

  setUnit: (newUnit: Unit) => {
    const { unit: oldUnit, dimensions } = get();
    if (newUnit === oldUnit) return;
    const dims = [dimensions.l, dimensions.w, dimensions.h];
    const converted = newUnit === 'in' ? convertToIn(dims) : convertToCm(dims);
    set({
      unit: newUnit,
      dimensions: { l: converted[0], w: converted[1], h: converted[2] },
      results: [],
    });
    persistState(get());
  },

  setWeight: (weight: number | null) => {
    set({ weight, results: [] });
    persistState(get());
  },

  setWeightUnit: (newUnit: WeightUnit) => {
    const { weightUnit: oldUnit, weight } = get();
    if (newUnit === oldUnit) return;
    if (weight !== null && weight > 0) {
      const converted = newUnit === 'lb'
        ? convertKgToLb(weight)
        : convertWeightToKg(weight, 'lb');
      set({ weightUnit: newUnit, weight: converted, results: [] });
    } else {
      set({ weightUnit: newUnit, results: [] });
    }
    persistState(get());
  },

  checkFit: (airlines) => {
    const { dimensions, unit, bagType, weight, weightUnit } = get();

    // Convert to cm if needed
    const rawDims = [dimensions.l, dimensions.w, dimensions.h];
    const userDims = unit === 'in' ? convertToCm(rawDims) : rawDims;

    // Convert user weight to kg
    const userWeightKg = weight !== null && weight > 0
      ? convertWeightToKg(weight, weightUnit)
      : null;

    const results: FitResult[] = airlines
      .map((airline) => {
        const allowance = airline.allowances[bagType];
        const maxDims = allowance?.maxCm || null;
        const maxWeightKg = allowance?.maxKg ?? null;

        let dimensionOutcome: FitOutcome = 'unknown';
        let volumeDiff: number | undefined;

        if (maxDims) {
          if (isTotalDimensionLimit(maxDims)) {
            const userTotal = calculateTotalDimension(userDims);
            dimensionOutcome = userTotal <= maxDims[0] ? 'fits' : 'doesnt-fit';
            volumeDiff = Math.round(((userTotal - maxDims[0]) / maxDims[0]) * 100);
          } else {
            const userSorted = [...userDims].sort((a, b) => b - a);
            const maxSorted = [...maxDims].sort((a, b) => b - a);
            const fits = userSorted.every((dim, i) => dim <= (maxSorted[i] || 0));
            dimensionOutcome = fits ? 'fits' : 'doesnt-fit';

            const userVol = userDims.reduce((a, b) => a * b, 1);
            const maxVol = maxDims.reduce((a, b) => a * b, 1);
            volumeDiff = Math.round(((userVol - maxVol) / maxVol) * 100);
          }
        }

        const weightOutcome = checkWeightFit(userWeightKg, maxWeightKg);
        const outcome = combinedOutcome(dimensionOutcome, weightOutcome);

        return {
          airline,
          outcome,
          bagType,
          userDimensions: userDims,
          maxDimensions: maxDims,
          volumeDiff,
          dimensionOutcome,
          weightOutcome,
          userWeightKg,
          maxWeightKg,
        };
      });

    set({ results });
  },

  clearResults: () => set({ results: [] }),

  resetInputs: () => {
    set({
      dimensions: { ...defaultDimensions },
      unit: 'cm',
      weight: null,
      weightUnit: 'kg',
      results: [],
    });
    persistState(get());
  },

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedAirlineDetail: (code) => set({ selectedAirlineDetail: code }),

  setCompareSort: (sort) => set({ compareSort: sort }),

  setCheckPanelOpen: (open) => set({ checkPanelOpen: open }),
}));
