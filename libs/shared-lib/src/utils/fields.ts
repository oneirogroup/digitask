import { eck } from "./eck";

export const fields = eck("digitask.native", c => ({
  user: {
    profile: eck.c(c, "user:profile", c => ({
      task: c`task`,
      tokens: c`tokens`,
      chat: {
        rooms: c`chat:rooms`,
        messages: c`chat:messages`
      }
    })),
    tasks: eck.c(c, "tasks", c => ({
      filter: eck.c(c, "filter", c => ({
        partial: c`partial`
      })),
      filtered: c`filtered`
    }))
  },
  performance: c`performance`,
  rangeDate: c`rangeDate`
}));
