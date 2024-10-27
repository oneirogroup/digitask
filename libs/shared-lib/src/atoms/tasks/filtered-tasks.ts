import { selector } from "recoil";

import { fields } from "../../utils";
import { tasksAtom } from "../backend";
import { taskFiltersAtom } from "./filters";

export const filteredTasksSelector = selector({
  key: fields.tasks.filtered.toString(),
  get: ({ get }) => {
    const tasks = get(tasksAtom);
    const filter = get(taskFiltersAtom);

    return tasks.filter(task => !(filter.status !== "all" && task.status !== filter.status));
  }
});
