import { FC } from "react";

import { Block, Icon, Text, View } from "@oneiro/ui-kit";

import { palette } from "../../../../palette";
import { BlockContainer } from "../blocks";
import { Tag } from "./components/tag";
import { TaskDate } from "./components/task-date";
import { TaskProps } from "./task.types";

export const Task: FC<TaskProps> = ({ tags, reporter, location, date }) => {
  return (
    <BlockContainer className="flex gap-4">
      <Block className="flex flex-row items-center gap-4">
        <View className="flex-1">
          <Text>{reporter}</Text>
        </View>
        <View className="flex flex-row gap-3">
          {tags.map(tag => (
            <Tag key={tag.id} tag={tag.tag} icon={tag.icon} />
          ))}
        </View>
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="location" variables={{ fill: palette.primary["50"] }} />
        <Text className="text-primary">{location}</Text>
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="clock" state="filled" variables={{ fill: palette.neutral["50"] }} />
        <TaskDate {...date} />
      </Block>
      <Block></Block>
    </BlockContainer>
  );
};
