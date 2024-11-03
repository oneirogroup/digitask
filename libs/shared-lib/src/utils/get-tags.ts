import { Icons } from "@mdreal/ui-kit";

import { Task } from "../types/backend";

export interface TagProps {
  tag: string;
  icon: keyof Icons;
}

export const getTags = (task?: Task) => {
  if (!task) return [];
  const tags: TagProps[] = [];
  task.has_tv && tags.push({ tag: "tv", icon: "tv" });
  task.has_internet && tags.push({ tag: "internet", icon: "web" });
  task.has_voice && tags.push({ tag: "voice", icon: "phone" });
  return tags;
};
