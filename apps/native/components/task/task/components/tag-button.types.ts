import { TagProps } from "apps/native/components/task/task/components/tag.types";

export interface TagButtonProps {
  status: TagProps;
  isActive: boolean;

  onClick(tag: TagProps): void;
}
