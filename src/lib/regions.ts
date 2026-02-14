export interface Region {
  key: string;
  label: string;
  countries: string[];
}

export const regions: Region[] = [
  { key: 'europe', label: 'Europe', countries: ['IE', 'GB', 'DE', 'NL', 'FR', 'ES', 'PT', 'AT', 'SE', 'FI', 'PL', 'NO', 'IS', 'HU', 'CZ', 'BE'] },
  { key: 'americas', label: 'Americas', countries: ['US', 'CA'] },
  { key: 'asia', label: 'Asia Pacific', countries: ['JP', 'SG', 'HK', 'KR', 'TH', 'MY', 'PH', 'ID', 'CN', 'NZ', 'AU'] },
  { key: 'middle_east', label: 'Middle East & Africa', countries: ['AE', 'QA', 'TR'] },
];

export const regionMap: Record<string, string[]> = Object.fromEntries(
  regions.map(r => [r.key, r.countries])
);
