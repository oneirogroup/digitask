import { AuthHttp } from "@mdreal/ui-kit";

import { InternetAttachmentSchema, SignInSchema, TVAttachmentSchema, VoiceAttachmentSchema } from "./schemas";
import { Backend, DateRange, MessageOptions, WithPagination } from "./types";
import { PaginatedResponse } from "./types/backend/paginated-response";
import { urlBuilder } from "./utils";

export const authHttp = AuthHttp.instance();

export const api = {
  accounts: {
    login: {
      $post(data: SignInSchema) {
        return authHttp.post<Backend.AuthToken>("/accounts/login/", data);
      }
    },
    profile: {
      get $get() {
        return authHttp.get<Backend.ProfileData>("/accounts/profile/");
      }
    },
    messages: {
      $get(options?: WithPagination<MessageOptions>) {
        return authHttp.get<PaginatedResponse<Backend.Message>>(urlBuilder("/accounts/messages_mobile/", options));
      }
    },
    RoomsApiView: {
      get $get() {
        return authHttp.get<Backend.ChatRoom[]>("/accounts/RoomsApiView/");
      }
    }
  },
  services: {
    tasks: {
      get $get() {
        return authHttp.get<Backend.Task[]>("/services/tasks");
      },
      $post({
        type,
        ...data
      }: Omit<TVAttachmentSchema | InternetAttachmentSchema | VoiceAttachmentSchema, "passport" | "photo_modem"> & {
        task: number;
      }) {
        return authHttp.post<{ id: number }>(`/services/create_${type}/`, data, {
          "Content-Type": "multipart/form-data;"
        });
      },
      $patch(id: number, data: Partial<Backend.Task>) {
        return authHttp.patch(`/services/update_tv/${id}/`, data);
      },
      $patchMedia(id: number, data: FormData) {
        return authHttp.patch(`/services/update_tv/${id}/`, data);
      }
    },
    performance: {
      $get(range: Partial<DateRange> | null) {
        return authHttp.get<Backend.PerformanceProfile[]>(
          urlBuilder("/services/performance/", {
            start_date: range?.start ? range?.start.format("YYYY-MM-DD") : null,
            end_date: range?.end ? range?.end.format("YYYY-MM-DD") : null
          })
        );
      }
    },
    file: {
      upload: {
        $post(media: FormData) {
          return Promise.resolve(media.get("photo"));
        }
      }
    }
  }
};
