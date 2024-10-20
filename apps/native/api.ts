import { AuthHttp } from "@oneiro/ui-kit";

import { DateRange } from "./components/date-time-picker";
import { ChatRoom } from "./types/backend/chat-room";
import { PerformanceProfile } from "./types/backend/performance-profile";
import { ProfileData } from "./types/backend/profile-data";
import { Task } from "./types/backend/task";
import { urlBuilder } from "./utils/url-builder";

export const authHttp = AuthHttp.instance();

export const api = {
  accounts: {
    profile: {
      get $get() {
        return authHttp.get<ProfileData>("/accounts/profile/");
      }
    },
    RoomsApiView: {
      get $get() {
        return authHttp.get<ChatRoom[]>("/accounts/RoomsApiView/");
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
      $get(range: Partial<DateRange>) {
        return authHttp.get<PerformanceProfile[]>(
          urlBuilder("/services/performance/", {
            start_date: range.start ? range.start.format("YYYY-MM-DD") : null,
            end_date: range.end ? range.end.format("YYYY-MM-DD") : null
          })
        );
      }
    }
  }
};
