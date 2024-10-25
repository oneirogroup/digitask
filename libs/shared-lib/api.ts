import { AuthHttp } from "@mdreal/ui-kit";

import { SignInSchema } from "./schemas/auth/sign-in.schema";
import { MessageOptions } from "./types/api/message-options";
import { AuthToken } from "./types/backend/auth-token";
import { ChatRoom } from "./types/backend/chat-room";
import { PerformanceProfile } from "./types/backend/performance-profile";
import { PreviousMessages } from "./types/backend/previous-messages";
import { ProfileData } from "./types/backend/profile-data";
import { Task } from "./types/backend/task";
import { DateRange } from "./types/date-range";
import { WithPagination } from "./types/with/pagination";
import { urlBuilder } from "./utils/url-builder";

export const authHttp = AuthHttp.instance();

export const api = {
  accounts: {
    login: {
      $post(data: SignInSchema) {
        return authHttp.post<AuthToken>("/accounts/login/", data);
      }
    },
    profile: {
      get $get() {
        return authHttp.get<ProfileData>("/accounts/profile/");
      }
    },
    messages: {
      $get(options?: WithPagination<MessageOptions>) {
        return authHttp.get<PreviousMessages>(urlBuilder("/accounts/messages/", options));
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
      $get(range: Partial<DateRange> | null) {
        return authHttp.get<PerformanceProfile[]>(
          urlBuilder("/services/performance/", {
            start_date: range?.start ? range?.start.format("YYYY-MM-DD") : null,
            end_date: range?.end ? range?.end.format("YYYY-MM-DD") : null
          })
        );
      }
    }
  }
};
