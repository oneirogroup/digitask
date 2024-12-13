import { FC } from "react";
import { Text, View } from "react-native";

import { buttonTranslations } from "@digitask/native/components/task/task-view/task-view.utils";
import { Block, Button, Icon, Switch, When, cn } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { palette } from "../../../../../palette";
import { api } from "../../api";
import { DateService } from "../../services";
import { Backend, TaskStatuses } from "../../types";
import { Tag } from "./components/tag";
import { TaskDate } from "./components/task-date";
import { TaskProps } from "./task.types";

const statuses = [TaskStatuses.Waiting, TaskStatuses.Started, TaskStatuses.InProgress, TaskStatuses.Completed];

const tagTranslations = {
  tv: "TV",
  internet: "İnternet",
  voice: "Səs"
};

export const Task: FC<TaskProps> = ({ tags, task, updateTask }) => {
  const startDate = DateService.from(Date.parse(`${task.date} ${task.start_time}`));
  const endDate = DateService.from(Date.parse(`${task.date} ${task.end_time}`));

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Backend.Task> }) =>
      api.services.tasks.attachments.$patch(id, data),
    onSuccess(data, { id }) {
      updateTask?.({ ...data, id });
    }
  });

  return (
    <Block className="flex gap-4">
      <Block className="flex flex-row items-center gap-4">
        <View className="flex-1">
          <Text>{task.full_name}</Text>
        </View>
      </Block>
      <Block className="flex flex-row gap-3">
        {tags.map(tag => (
          <Tag key={tag.tag} tag={tagTranslations[tag.tag]} icon={tag.icon} />
        ))}
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="location" state="filled" variables={{ fill: palette.primary["50"] }} />
        <Text className="text-primary">{task.location}</Text>
      </Block>
      <Block className="flex flex-row gap-2">
        <Icon name="clock" state="filled" variables={{ fill: palette.neutral["50"] }} />
        <TaskDate start={startDate} end={endDate} />
      </Block>
      <Block className="flex flex-row justify-between">
        <View className="flex flex-row gap-2">
          <When condition={!!task.phone}>
            <Icon name="phone" state="filled" variables={{ fill: palette.success["60"] }} />
            <Text className="text-success">{task.phone}</Text>
          </When>
        </View>

        <Button
          variant={task.status === TaskStatuses.Waiting ? "secondary" : "primary"}
          disabled={task.status === TaskStatuses.Completed}
          onClick={() => {
            const idx = statuses.indexOf(task.status);
            if (idx >= statuses.length - 1) return;
            updateTaskMutation.mutate({ id: task.id, data: { status: statuses[idx + 1] } });
          }}
        >
          <Text
            className={cn(
              [TaskStatuses.Waiting, TaskStatuses.Completed].includes(task.status) ? "text-primary" : "text-white"
            )}
          >
            <Switch var={task.status}>
              <Switch.Case value={TaskStatuses.Waiting}>{buttonTranslations[TaskStatuses.Waiting]}</Switch.Case>
              <Switch.Case value={TaskStatuses.InProgress}>{buttonTranslations[TaskStatuses.InProgress]}</Switch.Case>
              <Switch.Case value={TaskStatuses.Started}>{buttonTranslations[TaskStatuses.Started]}</Switch.Case>
              <Switch.Case value={TaskStatuses.Completed}>{buttonTranslations[TaskStatuses.Completed]}</Switch.Case>
            </Switch>
          </Text>
        </Button>
      </Block>
    </Block>
  );
};
