import { FC } from "react";
import { Text, View } from "react-native";

import { Block, Icon } from "@mdreal/ui-kit";

import { palette } from "../../../../palette";
import { DateService } from "../../services/date-service";
import { BlockContainer } from "../blocks";
import { Tag } from "./components/tag";
import { TaskDate } from "./components/task-date";
import { TaskProps } from "./task.types";

export const Task: FC<TaskProps> = ({ tags, task }) => {
  const startDate = DateService.from(Date.parse(task.date) + Date.parse(`1970-01-01 ${task.start_time}`));
  const endDate = DateService.from(Date.parse(task.date) + Date.parse(`1970-01-01 ${task.end_time}`));

  return (
    <BlockContainer className="flex gap-4">
      <Block className="flex flex-row items-center gap-4">
        <View className="flex-1">
          <Text>{task.full_name}</Text>
        </View>
        <View className="flex flex-row gap-3">
          {tags.map(tag => (
            <Tag key={tag.tag} tag={tag.tag} icon={tag.icon} />
          ))}
        </View>
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="location" variables={{ fill: palette.primary["50"] }} />
        <Text className="text-primary">{task.location}</Text>
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="clock" state="filled" variables={{ fill: palette.neutral["50"] }} />
        <TaskDate start={startDate} end={endDate} />
      </Block>
      <Block></Block>
    </BlockContainer>
  );
};
