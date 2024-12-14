import { TagProps } from "apps/native/components/task/task/components/tag.types";

import { DateService } from "@digitask/shared-lib/src/services";
import { Backend } from "@digitask/shared-lib/src/types";

export interface TaskDate {
  start: DateService;
  end: DateService;
}

export interface TaskProps {
  task: Backend.Task;
  tags: TagProps[];
  updateTask?(task: Backend.Task): void;
}
