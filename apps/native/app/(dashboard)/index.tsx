import { Text } from "react-native";

import { Block, Icon, If } from "@oneiro/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { palette } from "../../../../palette";
import { api } from "../../api";
import { BlockContainer, BlockSection } from "../../components/blocks";
import { Event } from "../../components/event";
import { Task } from "../../components/task";
import { DateService } from "../../services/date-service";
import { cache } from "../../utils/cache";
import { getTags } from "../../utils/get-tags";

export default function Index() {
  const { data: task } = useQuery({
    queryKey: [cache.user.profile.tasks],
    queryFn: () => api.services.tasks.$get,
    select(tasks) {
      return tasks[0];
    }
  });

  const date = DateService.from();
  const formattedDate = date.format("DD MMM");

  return (
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

      <BlockSection title="Davam edən tasklar">
        <If condition={!!task}>
          <If.Then>
            <Task task={task!} tags={getTags(task)} />
          </If.Then>

          <If.Else>
            <Text>Task tapılmadı</Text>
          </If.Else>
        </If>
      </BlockSection>

      <BlockSection title="Tədbirlər">
        <Event name="Tədbir adı" date={new Date()} />
      </BlockSection>
    </Block.Scroll>
  );
}
