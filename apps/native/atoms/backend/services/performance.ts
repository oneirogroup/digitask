import { atom } from "recoil";

import { DateRange } from "../../../components/date-time-picker";
import { PerformanceProfile } from "../../../types/backend/performance-profile";
import { fields } from "../../../utils/fields";

export const performanceAtom = atom<PerformanceProfile[]>({
  key: fields.performance,
  default: []
});

export const rangeDateAtom = atom<Partial<DateRange> | null>({
  key: fields.rangeDate,
  default: null
});
