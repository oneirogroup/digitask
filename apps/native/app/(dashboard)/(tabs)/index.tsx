import { Text } from "react-native";

import { api } from "@digitask/shared-lib/api";
import { tasksAtom } from "@digitask/shared-lib/atoms/backend/services/tasks";
import { Task } from "@digitask/shared-lib/components/task";
import { useRecoilQuery } from "@digitask/shared-lib/hooks/use-recoil-query";
import { DateService } from "@digitask/shared-lib/services/date-service";
import { fields } from "@digitask/shared-lib/utils/fields";
import { getTags } from "@digitask/shared-lib/utils/get-tags";
import { Block, Icon, If } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { BlockContainer, BlockSection } from "../../../components/blocks";
import { Event } from "../../../components/event";

export default function Index() {
  const { data: task } = useRecoilQuery(tasksAtom, {
    queryKey: [fields.user.profile.tasks],
    queryFn: () => api.services.tasks.$get,
    select(tasks) {
      return tasks[0];
    }
  });

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

        <BlockSection title="Davam edən tasklar" href="/(dashboard)/task">
          <If condition={!!task}>
            <If.Then>
              <Task task={task!} tags={getTags(task)} />
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
