import { atom } from "recoil";

import { PerformanceProfile } from "../../../types/backend/performance-profile";
import { DateRange } from "../../../types/date-range";
import { fields } from "../../../utils/fields";

export const performanceAtom = atom<PerformanceProfile[]>({
  key: fields.performance,
  default: []
});

export const rangeDateAtom = atom<Partial<DateRange> | null>({
  key: fields.rangeDate,
  default: null
});
