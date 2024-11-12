import { DateService } from "../../services";
import { Backend } from "../../types";
import { TagProps } from "./components/tag.types";

export interface TaskDate {
  start: DateService;
  end: DateService;
}

export interface TaskProps {
  task: Backend.Task;
  tags: TagProps[];
  updateTask?(task: Backend.Task): void;
}
