import { FC } from "react";
import { Text, View } from "react-native";

import { Block, Button, Icon, Switch, When, cn } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { DateService } from "../../services";
import { TaskStatuses } from "../../types";
import { Tag } from "./components/tag";
import { TaskDate } from "./components/task-date";
import { TaskProps } from "./task.types";

export const Task: FC<TaskProps> = ({ tags, task }) => {
  const startDate = DateService.from(Date.parse(task.date) + Date.parse(`1970-01-01 ${task.start_time}`));
  const endDate = DateService.from(Date.parse(task.date) + Date.parse(`1970-01-01 ${task.end_time}`));

  return (
    <Block className="flex gap-4">
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
      <Block className="flex flex-row justify-between">
        <View className="flex flex-row gap-2">
          <When condition={!!task.phone}>
            <Icon name="phone" variables={{ fill: palette.success["60"] }} />
            <Text className="text-success">{task.phone}</Text>
          </When>
        </View>

        <Button
          variant={task.status === TaskStatuses.Waiting ? "secondary" : "primary"}
          disabled={task.status === TaskStatuses.Completed}
          onClick={() => {}}
        >
          <Text
            className={cn(
              [TaskStatuses.Waiting, TaskStatuses.Completed].includes(task.status) ? "text-primary" : "text-white"
            )}
          >
            <Switch var={task.status}>
              <Switch.Case value={TaskStatuses.Waiting}>Qəbul et</Switch.Case>
              <Switch.Case value={TaskStatuses.Started}>Başla</Switch.Case>
              <Switch.Case value={TaskStatuses.InProgress}>Tamamla</Switch.Case>
              <Switch.Case value={TaskStatuses.Completed}>Tamamlandı</Switch.Case>
            </Switch>
          </Text>
        </Button>
      </Block>
    </Block>
  );
};
