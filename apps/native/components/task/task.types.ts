import { WithId } from "../../types/with-id";
import { TagProps } from "./components/tag.types";

export interface TaskDate {
  start: Date;
  end?: Date;
}

export interface TaskProps {
  reporter: string;
  tags: WithId<TagProps>[];
  location: string;
  date: TaskDate;
  phone: string;
  status: string;
}
