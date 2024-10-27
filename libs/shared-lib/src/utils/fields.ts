import { eck } from "./eck";

export const fields = eck("digitask.native", c => ({
  user: c.e("user", c => ({
    profile: c.e("profile", c => ({
      task: c`task`,
      tokens: c`tokens`
    })),
    token: c`token`
  })),
  chat: c.e("chat", c => ({
    rooms: c.e("rooms", c => ({
      active: c`active`
    })),
    messages: c.e("messages", c => ({
      all: c`all`,
      active: c`active`
    }))
  })),
  tasks: c.e("tasks", c => ({
    filter: c.e("filter", c => ({
      partial: c`partial`
    })),
    filtered: c`filtered`
  })),
  performance: c`performance`,
  rangeDate: c`rangeDate`
}));
