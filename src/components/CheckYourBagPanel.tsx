import { useCallback } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ScrollTrigger } from '@/lib/gsap-setup';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { validateDimensions } from '@/lib/fitLogic';
import { DimensionInput } from '@/components/DimensionInput';
import { WeightInput } from '@/components/WeightInput';
import { VisualSizer } from '@/components/VisualSizer';
import { Ruler, ChevronDown, Search } from 'lucide-react';
import type { Airline, BagType } from '@/types';

interface CheckYourBagPanelProps {
  airlines: Airline[];
  className?: string;
}

const defaultMaxDims: Record<BagType, [number, number, number]> = {
  cabin: [55, 40, 20],
  underseat: [40, 30, 20],
  checked: [90, 75, 43],
};

export function CheckYourBagPanel({ airlines, className }: CheckYourBagPanelProps) {
  const {
    checkPanelOpen,
    setCheckPanelOpen,
    dimensions,
    unit,
    setDimensions,
    setUnit,
    weight,
    weightUnit,
    setWeight,
    setWeightUnit,
    bagType,
    results,
    checkFit,
  } = useAppStore();

  const fitsCount = results.filter((r) => r.outcome === 'fits').length;
  const doesntFitCount = results.filter((r) => r.outcome === 'doesnt-fit').length;
  const hasResults = results.length > 0;
  const isValid = validateDimensions(dimensions);

  const handleCheckFit = useCallback(() => {
    checkFit(airlines);
    // Wait for DOM to settle after summary appears
    setTimeout(() => ScrollTrigger.refresh(), 250);
  }, [airlines, checkFit]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setCheckPanelOpen(open);
      // Wait for collapsible animation to finish
      setTimeout(() => ScrollTrigger.refresh(), 250);
    },
    [setCheckPanelOpen]
  );

  return (
    <Collapsible.Root
      open={checkPanelOpen}
      onOpenChange={handleOpenChange}
      className={cn('bg-white border border-foreground/15 rounded-xl', className)}
    >
      <Collapsible.Trigger asChild>
        <button className="flex items-center justify-between w-full px-5 py-4 text-left group">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
              <Ruler className="w-4 h-4 text-accent" />
            </div>
            <span className="font-heading font-bold text-foreground">Check your bag</span>
            {hasResults && (
              <span className="text-sm text-foreground/60">
                {fitsCount} fit, {doesntFitCount} don&apos;t
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-foreground/40 transition-transform duration-200',
              checkPanelOpen && 'rotate-180'
            )}
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="px-5 pb-5 border-t border-foreground/10 pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input column — dark bg to match input component styling */}
            <div className="section-dark-inset bg-background rounded-xl p-5 space-y-5">
              <DimensionInput
                dimensions={dimensions}
                unit={unit}
                onChange={setDimensions}
                onUnitChange={setUnit}
              />
              <WeightInput
                weight={weight}
                weightUnit={weightUnit}
                onChange={setWeight}
                onUnitChange={setWeightUnit}
              />
              <button
                onClick={handleCheckFit}
                disabled={!isValid}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 px-6 py-3',
                  'bg-accent text-accent-foreground font-heading font-bold rounded-lg',
                  'hover:brightness-110 transition-all duration-200 btn-lift',
                  !isValid && 'opacity-50 cursor-not-allowed hover:brightness-100'
                )}
              >
                <Search className="w-4 h-4" />
                Check fit
              </button>
            </div>

            {/* Visual sizer (desktop only) */}
            <div className="hidden lg:flex items-center justify-center section-dark-inset bg-background rounded-xl p-6 min-h-[280px]">
              <VisualSizer
                dimensions={dimensions}
                maxDimensions={defaultMaxDims[bagType]}
                unit={unit}
                outcome="unknown"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
