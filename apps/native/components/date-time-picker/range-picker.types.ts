import { DateRange } from "@digitask/shared-lib/types/date-range";

export interface RangePickerProps {
  onChange?(range: DateRange | null): void;
}
