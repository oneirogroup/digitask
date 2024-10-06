import { DateService } from "../../services/date-service";

export interface DateRange {
  start: DateService;
  end: DateService;
}

export interface RangePickerProps {
  onChange?(range: DateRange): void;
}
