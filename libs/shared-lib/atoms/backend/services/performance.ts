import { PerformanceProfile } from "libs/shared-lib/types/backend/performance-profile";
import { DateRange } from "libs/shared-lib/types/date-range";
import { fields } from "libs/shared-lib/utils/fields";
import { atom } from "recoil";

export const performanceAtom = atom<PerformanceProfile[]>({
  key: fields.performance,
  default: []
});

export const rangeDateAtom = atom<Partial<DateRange> | null>({
  key: fields.rangeDate,
  default: null
});
