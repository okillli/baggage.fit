export type BagType = 'cabin' | 'underseat' | 'checked';
export type Unit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type FitOutcome = 'fits' | 'doesnt-fit' | 'unknown';
export type SortOption = 'largest' | 'strictest' | 'alphabetical';
export type FitFilter = 'all' | 'fits' | 'doesnt-fit';

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
  dimensionOutcome: FitOutcome;
  weightOutcome: FitOutcome;
  userWeightKg: number | null;
  maxWeightKg: number | null;
}

export interface AppState {
  // User inputs
  bagType: BagType;
  dimensions: Dimensions;
  unit: Unit;
  weight: number | null;
  weightUnit: WeightUnit;

  // Centralized airline data
  airlines: Airline[];
  airlinesLoading: boolean;
  airlinesError: string | null;

  // Results
  results: FitResult[];

  // UI state
  currentView: 'hero' | 'browse';
  selectedAirlineDetail: string | null;
  compareSort: SortOption;
  checkPanelOpen: boolean;

  // Actions
  loadAirlines: () => Promise<void>;
  setBagType: (type: BagType) => void;
  setDimensions: (dims: Partial<Dimensions>) => void;
  setUnit: (unit: Unit) => void;
  setWeight: (weight: number | null) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  checkFit: (airlines: Airline[]) => void;
  clearResults: () => void;
  resetInputs: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedAirlineDetail: (code: string | null) => void;
  setCompareSort: (sort: SortOption) => void;
  setCheckPanelOpen: (open: boolean) => void;
}
