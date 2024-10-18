import { AuthHttp } from "@oneiro/ui-kit";

import { DateRange } from "./components/date-time-picker";
import { PerformanceProfile } from "./types/backend/performance-profile";
import { ProfileData } from "./types/backend/profile-data";
import { Task } from "./types/backend/task";

export const api = {
  accounts: {
    profile: {
      get $get() {
        return AuthHttp.instance().get<ProfileData>("/accounts/profile/");
      }
    }
  },
  services: {
    tasks: {
      get $get() {
        return AuthHttp.instance().get<Task[]>("/services/tasks");
      }
    },
    performance: {
      $get(range: DateRange) {
        return AuthHttp.instance().get<PerformanceProfile[]>("/services/performance/");
      }
    }
  }
};
