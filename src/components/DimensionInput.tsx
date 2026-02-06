import { useId } from 'react';
import { cn } from '@/lib/utils';
import { UnitToggle } from './UnitToggle';
import type { Dimensions, Unit } from '@/types';
import { parseDimensionInput } from '@/lib/fitLogic';

interface DimensionInputProps {
  dimensions: Dimensions;
  unit: Unit;
  onChange: (dims: Partial<Dimensions>) => void;
  onUnitChange: (unit: Unit) => void;
  className?: string;
}

export function DimensionInput({
  dimensions,
  unit,
  onChange,
  onUnitChange,
  className,
}: DimensionInputProps) {
  const id = useId();

  const fields = [
    { key: 'l' as const, label: 'Length', placeholder: '55' },
    { key: 'w' as const, label: 'Width', placeholder: '40' },
    { key: 'h' as const, label: 'Height', placeholder: '20' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="section-label">Dimensions</span>
        <UnitToggle value={unit} onChange={onUnitChange} />
      </div>

      <div className="flex items-center gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex-1">
            <label
              htmlFor={`${id}-${field.key}`}
              className="block text-xs text-muted-foreground mb-1.5"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                id={`${id}-${field.key}`}
                type="number"
                min="0"
                step="0.1"
                value={dimensions[field.key] ?? ''}
                onChange={(e) =>
                  onChange({ [field.key]: parseDimensionInput(e.target.value) })
                }
                placeholder={field.placeholder}
                className={cn(
                  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3',
                  'text-foreground placeholder:text-muted-foreground/50',
                  'input-focus transition-all'
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Most airlines list max size. Add 1–2 {unit} for wheels/handles if yours stick out.
      </p>
    </div>
  );
}
