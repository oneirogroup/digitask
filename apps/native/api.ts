import { AuthHttp } from "@oneiro/ui-kit";

import { Task } from "./types/backend/task";

export const api = {
  services: {
    tasks: {
      get $get() {
        return AuthHttp.instance().get<Task[]>("/services/tasks");
      }
    }
  }
};
