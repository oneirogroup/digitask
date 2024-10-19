import { AuthHttp } from "@oneiro/ui-kit";

import { DateRange } from "./components/date-time-picker";
import { PerformanceProfile } from "./types/backend/performance-profile";
import { ProfileData } from "./types/backend/profile-data";
import { Task } from "./types/backend/task";

export const authHttp = AuthHttp.instance();

export const api = {
  accounts: {
    profile: {
      get $get() {
        return authHttp.get<ProfileData>("/accounts/profile/");
      }
    }
  },
  services: {
    tasks: {
      get $get() {
        return authHttp.get<Task[]>("/services/tasks");
      }
    },
    performance: {
        return AuthHttp.instance().get<PerformanceProfile[]>(
          `/services/performance/?start_date=${range.start.format("YYYY-MM-DD")}&end_date=${range.end.format("YYYY-MM-DD")}`
      $get(range: Partial<DateRange>) {
        );
      }
    }
  }
};
