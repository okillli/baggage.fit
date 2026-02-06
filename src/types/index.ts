export type BagType = 'cabin' | 'underseat' | 'checked';
export type Unit = 'cm' | 'in';
export type FitOutcome = 'fits' | 'doesnt-fit' | 'unknown';
export type SortOption = 'largest' | 'strictest' | 'alphabetical';

export interface BagAllowance {
  maxCm: number[] | null;
  maxKg: number | null;
  notes?: string;
}

export interface Airline {
  code: string;
  name: string;
  country: string;
  links: {
    policy: string;
    calculator?: string;
  };
  lastVerified: string;
  allowances: {
    cabin?: BagAllowance;
    underseat?: BagAllowance;
    checked?: BagAllowance;
  };
}

export interface Dimensions {
  l: number;
  w: number;
  h: number;
}

export interface FitResult {
  airline: Airline;
  outcome: FitOutcome;
  bagType: BagType;
  userDimensions: number[];
  maxDimensions: number[] | null;
  volumeDiff?: number;
}

export interface AppState {
  // User inputs
  bagType: BagType;
  dimensions: Dimensions;
  unit: Unit;
  selectedAirlines: string[];

  // Centralized airline data
  airlines: Airline[];
  airlinesLoading: boolean;

  // Results
  results: FitResult[];

  // UI state
  currentView: 'hero' | 'check' | 'compare' | 'airline';
  selectedAirlineDetail: string | null;
  compareSort: SortOption;
  compareBagType: BagType;

  // Actions
  loadAirlines: () => Promise<void>;
  setBagType: (type: BagType) => void;
  setDimensions: (dims: Partial<Dimensions>) => void;
  setUnit: (unit: Unit) => void;
  toggleAirline: (code: string) => void;
  selectAllPopularAirlines: () => void;
  clearSelectedAirlines: () => void;
  checkFit: (airlines: Airline[]) => void;
  clearResults: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedAirlineDetail: (code: string | null) => void;
  setCompareSort: (sort: SortOption) => void;
  setCompareBagType: (type: BagType) => void;
}
