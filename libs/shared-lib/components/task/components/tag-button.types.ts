import { Tag } from "./tag.types";

export interface TagButtonProps {
  status: Tag[0];
  isActive: boolean;

  onClick(tag: Tag[0]): void;
}
