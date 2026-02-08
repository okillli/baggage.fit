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

  const result = selectedAirlineDetail
    ? results.find((r) => r.airline.code === selectedAirlineDetail) ?? null
    : null;

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
        className="w-full md:w-[600px] md:max-w-[90vw] sm:max-w-none z-[60] overflow-y-auto"
      >
        {airline && (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{airline.name} Baggage Details</SheetTitle>
              <SheetDescription>
                View baggage allowances for {airline.name}
              </SheetDescription>
            </SheetHeader>
            <AirlineDetailContent
              airline={airline}
              result={result}
              userDimensions={dimensions}
              userWeightKg={userWeightKg}
              activeBagType={bagType}
              unit={unit}
              weightUnit={weightUnit}
              className="pt-2"
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
