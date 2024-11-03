import { router } from "expo-router";
import { api } from "libs/shared-lib/src/api";
import { Pressable, Text } from "react-native";
import { useSetRecoilState } from "recoil";

import {
  DateService,
  Task,
  TaskStatuses,
  fields,
  getTags,
  tasksAtom,
  tasksFilterSelector,
  useRecoilQuery
} from "@digitask/shared-lib";
import { Block, Icon, If } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { BlockContainer, BlockSection } from "../../../components/blocks";
import { Event } from "../../../components/event";

export default function Index() {
  const setFilter = useSetRecoilState(tasksFilterSelector);
  const { data: tasks } = useRecoilQuery(tasksAtom, {
    queryKey: [fields.tasks],
    queryFn: () => api.services.tasks.$get,
    isNullable: true
  });

  const task = tasks?.find(task => task.status === TaskStatuses.InProgress);

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
                percentage: Math.round((12 / (12 + 20)) * 100),
                fillFgColor: palette.secondary["80"],
                fillBgColor: palette.primary["50"],
                text: "32 task",
                subtext: "tamamlandı",
                textColor: "black"
              }}
            />
          </Block>

          <Block className="flex flex-row justify-center gap-4">
            <Text>
              <Text>Qoşulmalar</Text>
              <Text>12</Text>
            </Text>

            <Text>
              <Text>Problemlər</Text>
              <Text>20</Text>
            </Text>
          </Block>
        </BlockContainer>

        <BlockSection
          title="Davam edən tasklar"
          onClick={() => setFilter({ status: TaskStatuses.InProgress })}
          href="/(dashboard)/task"
        >
          <If condition={!!task}>
            <If.Then>
              <BlockContainer>
                <Pressable
                  onPress={() => router.push({ pathname: "/(dashboard)/[taskId]", params: { taskId: task!.id } })}
                >
                  <Task task={task!} tags={getTags(task)} />
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

export const config = {
  navigationOptions: {
    title: "Dashboard"
  }
};
