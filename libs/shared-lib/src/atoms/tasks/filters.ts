import { atom, selector } from "recoil";

import { TaskFilter } from "../../types";
import { fields } from "../../utils";

export const taskFiltersAtom = atom<TaskFilter>({
  key: fields.tasks.filter.toString(),
  default: { status: "all" }
});

export const tasksFilterSelector = selector<Partial<TaskFilter>>({
  key: fields.tasks.filter.partial.toString(),
  get: ({ get }) => get(taskFiltersAtom),
  set: ({ get, set }, newValue) => {
    const current = get(taskFiltersAtom);
    set(taskFiltersAtom, { ...current, ...newValue });
  }
});
