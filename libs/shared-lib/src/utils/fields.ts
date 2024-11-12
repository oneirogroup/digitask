import { eck } from "./eck";

export const fields = eck("digitask.native", c => ({
  user: c.e("user", c => ({
    profile: c.e("profile", c => ({
      task: c`task`,
      tokens: c`tokens`
    })),
    signIn: c.e("signIn", c => ({
      selector: c`selector`
    })),
    token: c`token`
  })),
  chat: c.e("chat", c => ({
    rooms: c.e("rooms", c => ({
      active: c`active`
    })),
    messages: c.e("messages", c => ({
      all: c`all`,
      active: c`active`,
      paginated: c`paginated`,
      pagination: c`pagination`,
      page: c`page`,
      size: c`size`
    }))
  })),
  task: c`task`,
  tasks: c.e("tasks", c => ({
    filter: c.e("filter", c => ({
      partial: c`partial`
    })),
    filtered: c`filtered`,
    create: c`create`,
    type: c`type`
  })),
  performance: c`performance`,
  rangeDate: c`rangeDate`,
  file: c.e("file", c => ({
    upload: c`upload`
  }))
}));
