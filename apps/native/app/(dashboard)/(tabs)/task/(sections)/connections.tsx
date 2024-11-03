import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  Task,
  TaskStatuses,
  filteredTasksSelector,
  getTags,
  taskFiltersAtom,
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
  const filter = useRecoilValue(taskFiltersAtom);
  const setFilter = useSetRecoilState(tasksFilterSelector);
  const filteredTasks = useRecoilValue(filteredTasksSelector);

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
            onPress={() => router.push({ pathname: "/(dashboard)/[taskId]", params: { taskId: task!.id } })}
          >
            <BlockContainer>
              <Task task={task} tags={getTags(task)} />
            </BlockContainer>
          </Pressable>
        ))}
      </Block>
    </Block.Scroll>
  );
}
