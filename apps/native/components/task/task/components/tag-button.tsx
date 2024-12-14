import { TagButtonProps } from "apps/native/components/task/task/components/tag-button.types";

import { FC } from "react";
import { Text } from "react-native";

import { Button, cn } from "@mdreal/ui-kit";

export const TagButton: FC<TagButtonProps> = ({ isActive, status, onClick }) => {
  return (
    <Button
      variant={isActive ? "primary" : "secondary"}
      className="rounded-2.25xl"
      onClick={() => !isActive && onClick(status)}
    >
      <Text className={cn({ "text-primary": !isActive, "text-white": isActive })}>{status.tag}</Text>
    </Button>
  );
};
