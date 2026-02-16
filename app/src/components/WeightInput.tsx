import { useId } from 'react';
import { cn } from '@/lib/utils';
import { UnitToggle } from './UnitToggle';
import type { WeightUnit } from '@/types';

interface WeightInputProps {
  weight: number | null;
  weightUnit: WeightUnit;
  onChange: (weight: number | null) => void;
  onUnitChange: (unit: WeightUnit) => void;
  className?: string;
}

export function WeightInput({
  weight,
  weightUnit,
  onChange,
  onUnitChange,
  className,
}: WeightInputProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(null);
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="section-label">
          Weight <span className="text-muted-foreground">(optional)</span>
        </label>
        <UnitToggle
          value={weightUnit}
          options={['kg', 'lb']}
          onChange={onUnitChange}
          label="Weight unit"
        />
      </div>

      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={weight ?? ''}
          onChange={handleChange}
          placeholder={weightUnit === 'kg' ? '10' : '22'}
          className={cn(
            'w-full bg-secondary border border-border rounded-lg px-3 py-3',
            'text-foreground placeholder:text-muted-foreground/50',
            'input-focus transition-all'
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {weightUnit}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Weigh your bag packed and ready to go. Leave empty to skip weight check.
      </p>
    </div>
  );
}
