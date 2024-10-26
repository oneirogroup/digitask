import { atom } from "recoil";

import { Task } from "../../../types/backend/task";
import { fields } from "../../../utils/fields";

export const tasksAtom = atom<Task[]>({
  key: fields.user.tasks.toString(),
  default: []
});
