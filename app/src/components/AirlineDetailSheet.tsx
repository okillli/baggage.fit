import { useAppStore } from '@/store/appStore';
import { AirlineDetailContent } from './AirlineDetailContent';
import { convertWeightToKg } from '@/lib/fitLogic';
import { pauseSnap } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export function AirlineDetailSheet() {
  const {
    selectedAirlineDetail,
    setSelectedAirlineDetail,
    airlines,
    results,
    bagType,
    dimensions,
    unit,
    weight,
    weightUnit,
  } = useAppStore();

  const airline = selectedAirlineDetail
    ? airlines.find((a) => a.code === selectedAirlineDetail)
    : null;

  const hasChecked = results.length > 0;
  const userWeightKg = weight != null && weight > 0
    ? convertWeightToKg(weight, weightUnit)
    : null;

  return (
    <Sheet
      open={!!airline}
      onOpenChange={(open) => {
        if (!open) {
          pauseSnap(500);
          setSelectedAirlineDetail(null);
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full md:w-[600px] md:max-w-[90vw] sm:max-w-none z-sheet overflow-y-auto"
      >
        {airline && (
          <>
            <SheetHeader>
              <SheetTitle className="text-lg font-heading font-bold flex items-center gap-2">
                {airline.name}
                <span className="text-xs text-muted-foreground font-mono font-normal">{airline.code}</span>
              </SheetTitle>
              <SheetDescription className="sr-only">
                View baggage allowances for {airline.name}
              </SheetDescription>
            </SheetHeader>
            <AirlineDetailContent
              airline={airline}
              userDimensions={hasChecked ? dimensions : null}
              userWeightKg={hasChecked ? userWeightKg : null}
              activeBagType={bagType}
              unit={unit}
              weightUnit={weightUnit}
              showFitChecker
              hideHeader
              className="pt-2"
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
