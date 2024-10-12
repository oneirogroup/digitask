import { Task } from "../../types/backend/task";

interface TaskListWithTagsBaseProps {
  className?: string;
}

export interface Status {
  name: string;
  status: string;
}

export interface TaskListWithTagsProps extends TaskListWithTagsBaseProps {
  statuses: Status[];
  tasks: Task[];

  checkTag?(task: Task, tag: Status): boolean;

  onActiveStatusChange?(tag: Status): void;
}
