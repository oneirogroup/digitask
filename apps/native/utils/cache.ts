import { eck } from "./eck";

export const cache = {
  user: {
    profile: eck("digitask.native:user:profile", c => ({
      tasks: c`tasks`,
      chat: {
        rooms: c`chat:rooms`,
        messages: c`chat:messages`
      }
    }))
  },
  performance: "digitask.native:performance"
} as const;
