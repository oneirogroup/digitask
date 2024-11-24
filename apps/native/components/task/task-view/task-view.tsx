import { router } from "expo-router";
import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  Task,
  filteredTasksSelector,
  getTags,
  taskFiltersAtom,
  tasksAtom,
  tasksFilterSelector,
  uppercase,
  useRecoilArrayControls
} from "@digitask/shared-lib";
import { Block, Button, cn } from "@mdreal/ui-kit";

import { BlockContainer } from "../../blocks";
import type { TasksViewProps } from "./task-view.types";
import { statuses, translations } from "./task-view.utils";

export const TaskView: FC<TasksViewProps> = ({ taskType, className }) => {
  const controls = useRecoilArrayControls(tasksAtom(taskType));
  const filter = useRecoilValue(taskFiltersAtom(taskType));
  const setFilter = useSetRecoilState(tasksFilterSelector(taskType));
  const filteredTasks = useRecoilValue(filteredTasksSelector(taskType));

  return (
    <Block.Scroll>
      <View className={cn(className, "my-6", "flex gap-6")}>
        <Block.Scroll horizontal showsHorizontalScrollIndicator={false} contentClassName="flex flex-row gap-4">
          <View />
          {statuses.map(status => (
            <Button
              key={status}
              variant={filter.status === status ? "primary" : "secondary"}
              className="rounded-2.25xl"
              onClick={() => setFilter({ status })}
            >
              <Text
                className={cn({ "text-primary": filter.status !== status, "text-white": filter.status === status })}
              >
                {uppercase(translations[status])}
              </Text>
            </Button>
          ))}
          <View />
        </Block.Scroll>
      </View>

      <Block className="flex gap-6 p-6">
        {filteredTasks.map(task => (
          <Pressable
            key={task.id}
            onPress={() =>
              router.push({ pathname: "/[taskId]/task-type/[taskType]", params: { taskId: task!.id, taskType } })
            }
          >
            <BlockContainer>
              <Task task={task} tags={getTags(task)} updateTask={task => controls.update(task.id, task)} />
            </BlockContainer>
          </Pressable>
        ))}
      </Block>
    </Block.Scroll>
  );
};
