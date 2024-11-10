import { Backend } from "../../../build";
import { DateService } from "../../services/date-service";
import { Task } from "../../types/backend/task";
import { TagProps } from "./components/tag.types";

export interface TaskDate {
  start: DateService;
  end: DateService;
}

export interface TaskProps {
  task: Task;
  tags: TagProps[];
  updateTask?(task: Backend.Task): void;
}
