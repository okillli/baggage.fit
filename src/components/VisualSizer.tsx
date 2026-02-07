import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import type { Dimensions, Unit, WeightUnit } from '@/types';
import { formatWeight } from '@/lib/fitLogic';

interface VisualSizerProps {
  dimensions: Dimensions;
  maxDimensions?: [number, number, number] | null;
  unit?: Unit;
  outcome?: 'fits' | 'doesnt-fit' | 'unknown';
  userWeightKg?: number | null;
  maxWeightKg?: number | null;
  weightOutcome?: 'fits' | 'doesnt-fit' | 'unknown';
  weightUnit?: WeightUnit;
  className?: string;
  animate?: boolean;
}

export function VisualSizer({
  dimensions,
  maxDimensions,
  unit = 'cm',
  outcome = 'unknown',
  userWeightKg,
  maxWeightKg,
  weightOutcome = 'unknown',
  weightUnit = 'kg',
  className,
  animate = true,
}: VisualSizerProps) {
  const bagRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Calculate relative sizes for visualization
  const maxDims = maxDimensions || [55, 40, 20];

  // Convert user dimensions to cm for consistent visualization
  const userL = unit === 'in' ? dimensions.l * 2.54 : dimensions.l;
  const userW = unit === 'in' ? dimensions.w * 2.54 : dimensions.w;

  const scale = Math.min(
    200 / maxDims[0],
    140 / maxDims[1],
    100 / maxDims[2]
  );

  const bagWidth = Math.min(userL * scale, 200);
  const bagHeight = Math.min(userW * scale, 140);

  const frameWidth = maxDims[0] * scale;
  const frameHeight = maxDims[1] * scale;

  useEffect(() => {
    if (!animate || !bagRef.current || !frameRef.current) return;

    const bag = bagRef.current;
    const frame = frameRef.current;

    // Reset animations
    gsap.killTweensOf(bag);
    gsap.killTweensOf(frame);

    if (outcome === 'fits') {
      // Bag slides into frame with green glow
      gsap.to(bag, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
      gsap.to(frame, {
        boxShadow: '0 0 30px rgba(215, 255, 59, 0.4)',
        duration: 0.3,
      });
    } else if (outcome === 'doesnt-fit') {
      // Bag bounces back with red pulse
      gsap.to(bag, {
        x: -20,
        y: -10,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(frame, {
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
        duration: 0.3,
      });
    } else {
      // Neutral state
      gsap.to(bag, {
        x: -30,
        y: -15,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.to(frame, {
        boxShadow: 'none',
        duration: 0.3,
      });
    }
  }, [outcome, animate, dimensions]);

  const displayUnit = unit;
  const displayMaxL = unit === 'in' ? Math.round(maxDims[0] / 2.54 * 10) / 10 : maxDims[0];
  const displayMaxW = unit === 'in' ? Math.round(maxDims[1] / 2.54 * 10) / 10 : maxDims[1];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
    >
      {/* Sizer Frame */}
      <div
        ref={frameRef}
        className={cn(
          'absolute border-2 border-white/30 rounded-xl transition-shadow',
          'flex items-center justify-center'
        )}
        style={{
          width: frameWidth,
          height: frameHeight,
        }}
      >
        {/* Frame label */}
        <span className="absolute -bottom-6 text-xs text-muted-foreground font-mono">
          Airline max
        </span>

        {/* Dimension labels */}
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">
          {displayMaxL} {displayUnit}
        </span>
        <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono rotate-90">
          {displayMaxW} {displayUnit}
        </span>
      </div>

      {/* Bag Block */}
      <div
        ref={bagRef}
        className={cn(
          'absolute rounded-lg border-2 transition-colors',
          outcome === 'fits' && 'bg-accent/20 border-accent',
          outcome === 'doesnt-fit' && 'bg-red-500/20 border-red-500',
          outcome === 'unknown' && 'bg-white/10 border-white/40'
        )}
        style={{
          width: bagWidth,
          height: bagHeight,
          transform: 'translate(-30px, -15px)',
        }}
      >
        {/* Bag label */}
        <span className="absolute -top-5 left-0 text-xs text-accent font-mono">
          Your bag
        </span>

        {/* Bag dimensions */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-foreground/70">
            {dimensions.l}×{dimensions.w}×{dimensions.h}
          </span>
        </div>
      </div>

      {/* Depth indicator (3D effect) */}
      <div
        className={cn(
          'absolute rounded-lg border border-white/20',
          outcome === 'fits' && 'bg-accent/10',
          outcome === 'doesnt-fit' && 'bg-red-500/10',
          outcome === 'unknown' && 'bg-white/5'
        )}
        style={{
          width: bagWidth * 0.7,
          height: bagHeight * 0.7,
          transform: `translate(${bagWidth * 0.3 + 20}px, ${bagHeight * 0.3 + 20}px)`,
          zIndex: -1,
        }}
      />

      {/* Weight gauge bar */}
      {(userWeightKg != null || maxWeightKg != null) && (
        <WeightGauge
          userWeightKg={userWeightKg ?? null}
          maxWeightKg={maxWeightKg ?? null}
          weightOutcome={weightOutcome}
          weightUnit={weightUnit}
        />
      )}
    </div>
  );
}

function WeightGauge({
  userWeightKg,
  maxWeightKg,
  weightOutcome,
  weightUnit = 'kg',
}: {
  userWeightKg: number | null;
  maxWeightKg: number | null;
  weightOutcome: 'fits' | 'doesnt-fit' | 'unknown';
  weightUnit?: WeightUnit;
}) {
  const fillPercent = userWeightKg != null && maxWeightKg != null && maxWeightKg > 0
    ? Math.min((userWeightKg / maxWeightKg) * 100, 100)
    : 0;

  const label = userWeightKg != null && maxWeightKg != null
    ? `${formatWeight(userWeightKg, weightUnit)} / ${formatWeight(maxWeightKg, weightUnit)}`
    : maxWeightKg != null
      ? `Max ${formatWeight(maxWeightKg, weightUnit)}`
      : '';

  return (
    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-3/4 space-y-1">
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        {fillPercent > 0 && (
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              weightOutcome === 'fits' && 'bg-accent',
              weightOutcome === 'doesnt-fit' && 'bg-red-500',
              weightOutcome === 'unknown' && 'bg-white/30'
            )}
            style={{ width: `${fillPercent}%` }}
          />
        )}
      </div>
      <p className="text-xs font-mono text-muted-foreground text-center">{label}</p>
    </div>
  );
}
