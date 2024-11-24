import { router } from "expo-router";
import { Pressable, Text } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import {
  DateService,
  Task,
  TaskStatuses,
  getTags,
  tasksAtom,
  tasksFilterSelector,
  useRecoilArrayControls
} from "@digitask/shared-lib";
import { Block, Icon, If } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { BlockContainer, BlockSection } from "../../../components/blocks";
import { Event } from "../../../components/event";
import { TaskType } from "../../../types/task-type";

export default function Index() {
  const connectionTasks = useRecoilValue(tasksAtom(TaskType.Connection));
  const problemTasks = useRecoilValue(tasksAtom(TaskType.Problem));
  const connectionTask = connectionTasks?.find(task => task.status === TaskStatuses.InProgress);

  const finishedConnectionTasks = connectionTasks.filter(task => task.status === TaskStatuses.Completed);
  const finishedProblemTasks = problemTasks.filter(task => task.status === TaskStatuses.Completed);

  const controls = useRecoilArrayControls(tasksAtom(TaskType.Connection));
  const setFilter = useSetRecoilState(tasksFilterSelector(TaskType.Connection));

  const date = DateService.from();
  const formattedDate = date.format("DD MMM");

  return (
    <Block.Fade className="bg-neutral-95">
      <Block.Scroll contentClassName="flex justify-center items-start gap-4 p-4">
        <Text className="text-xl">{formattedDate}</Text>

        <BlockContainer className="flex items-center">
          <Block className="size-28">
            <Icon
              name="circle"
              variables={{
                percentage: Math.round(
                  (finishedConnectionTasks.length / (finishedConnectionTasks.length + finishedProblemTasks.length)) *
                    100
                ),
                fillFgColor: palette.secondary["80"],
                fillBgColor: palette.primary["50"],
                text: `${finishedConnectionTasks.length + finishedProblemTasks.length} task`,
                subtext: "tamamlandı",
                textColor: "black"
              }}
            />
          </Block>

          <Block className="flex flex-row justify-center gap-4">
            <Text>
              <Text>Qoşulmalar</Text>
              <Text> </Text>
              <Text>{finishedConnectionTasks.length},</Text>
            </Text>

            <Text>
              <Text>Problemlər</Text>
              <Text> </Text>
              <Text>{finishedProblemTasks.length}</Text>
            </Text>
          </Block>
        </BlockContainer>

        <BlockSection
          title="Davam edən tasklar"
          onClick={() => setFilter({ status: TaskStatuses.InProgress })}
          href="/task"
        >
          <If condition={!!connectionTask}>
            <If.Then>
              <BlockContainer>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/[taskId]/task-type/[taskType]",
                      params: { taskId: connectionTask!.id, taskType: TaskType.Connection }
                    })
                  }
                >
                  <Task
                    task={connectionTask!}
                    tags={getTags(connectionTask)}
                    updateTask={task => controls.update(task.id, task)}
                  />
                </Pressable>
              </BlockContainer>
            </If.Then>

            <If.Else>
              <Text>Task tapılmadı</Text>
            </If.Else>
          </If>
        </BlockSection>

        <BlockSection title="Tədbirlər" href="/">
          <Event name="Tədbir adı" date={new Date()} />
        </BlockSection>
      </Block.Scroll>
    </Block.Fade>
  );
}
