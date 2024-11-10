import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  Task,
  TaskStatuses,
  filteredTasksSelector,
  getTags,
  taskFiltersAtom,
  tasksAtom,
  tasksFilterSelector,
  uppercase
} from "@digitask/shared-lib";
import { Block, Button, cn } from "@mdreal/ui-kit";

import { BlockContainer } from "../../../../../components/blocks";

const statuses = [
  TaskStatuses.All,
  TaskStatuses.Started,
  TaskStatuses.Waiting,
  TaskStatuses.InProgress,
  TaskStatuses.Completed
];

export default function Connections() {
  const setTask = useSetRecoilState(tasksAtom("connection"));
  const filter = useRecoilValue(taskFiltersAtom("connection"));
  const setFilter = useSetRecoilState(tasksFilterSelector("connection"));
  const filteredTasks = useRecoilValue(filteredTasksSelector("connection"));

  return (
    <Block.Scroll>
      <View className={cn(/*className*/ "my-6", "flex gap-6")}>
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
                {uppercase(status)}
              </Text>
            </Button>
          ))}
          <View />
        </Block.Scroll>
      </View>

      <Block className="flex gap-6 p-6">
        {filteredTasks.slice(0, 12).map(task => (
          <Pressable
            key={task.id}
            onPress={() =>
              router.push({
                pathname: "/[taskId]/task-type/[taskType]",
                params: { taskId: task!.id, taskType: "connection" }
              })
            }
          >
            <BlockContainer>
              <Task
                task={task}
                tags={getTags(task)}
                updateTask={task => {
                  setTask(tasks => tasks.map(t => (t.id === task.id ? { ...t, ...task } : t)));
                }}
              />
            </BlockContainer>
          </Pressable>
        ))}
      </Block>
    </Block.Scroll>
  );
}
