import { atom } from "recoil";

import { Task } from "../../../types/backend";
import { fields } from "../../../utils";

export const tasksAtom = atom<Task[]>({
  key: fields.tasks.toString(),
  default: []
});
