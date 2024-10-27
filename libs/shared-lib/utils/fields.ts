import { eck } from "./eck";

export const fields = eck("digitask.native", c => ({
  user: {
    profile: eck.c(c, "user:profile", c => ({
      tasks: c`tasks`,
      task: c`task`,
      tokens: c`tokens`,
      chat: {
        rooms: c`chat:rooms`,
        messages: c`chat:messages`
      }
    }))
  },
  performance: c`performance`,
  rangeDate: c`rangeDate`
}));
