import { TagProps } from "../components/task/components/tag.types";
import { Task } from "../types/backend/task";

export const getTags = (task: Task) => {
  const tags: TagProps[] = [];
  task.has_tv && tags.push({ tag: "tv", icon: "tv" });
  task.has_internet && tags.push({ tag: "internet", icon: "web" });
  task.has_voice && tags.push({ tag: "voice", icon: "phone" });
  return tags;
};
