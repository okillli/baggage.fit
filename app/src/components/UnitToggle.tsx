import { useRef, useEffect, useCallback, useId } from 'react';
import { gsap } from '@/lib/gsap-setup';
import { cn } from '@/lib/utils';

interface UnitToggleProps<T extends string> {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
}

export function UnitToggle<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: UnitToggleProps<T>) {
  const id = useId();
  const pillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePill = useCallback(() => {
    if (!pillRef.current || !containerRef.current) return;
    const idx = options.indexOf(value);
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('button');
    if (!buttons[idx]) return;

    const btn = buttons[idx];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(pillRef.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: reducedMotion ? 0 : 0.25,
      ease: 'power2.out',
    });
  }, [value, options]);

  useEffect(() => {
    updatePill();
  }, [updatePill]);

  // Update pill on resize
  useEffect(() => {
    const handleResize = () => updatePill();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePill]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={label}
      className={cn(
        'relative inline-flex items-center bg-secondary rounded-lg p-1 border border-border',
        className
      )}
    >
      {/* Animated pill indicator */}
      <div
        ref={pillRef}
        className="absolute top-1 h-[calc(100%-8px)] bg-accent rounded-md"
        style={{ width: 0 }}
        aria-hidden="true"
      />

      {options.map((option) => (
        <button
          key={option}
          id={`${id}-${option}`}
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            'relative px-4 py-1.5 min-h-[44px] text-sm font-medium rounded-md transition-colors',
            value === option ? 'text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="relative z-10">{option}</span>
        </button>
      ))}
    </div>
  );
}
