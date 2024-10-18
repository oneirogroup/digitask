import { Text, View } from "react-native";

import { Block, Icon, logger } from "@oneiro/ui-kit";

import { palette } from "../../../../palette";
import { BlockContainer, BlockSection } from "../../components/blocks";
import { Event } from "../../components/event";
import { Task } from "../../components/task";
import { DateService } from "../../services/date-service";

export default function Index() {
  const date = new DateService();
  const formattedDate = date.format("dd MM");

  const startDate = DateService.from().add.hours(1);

  return (
    <View.Scroll contentClassName="flex justify-center items-start gap-4 p-4 ">
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
        <Task
          reporter="Ayxan Osmanov"
          tags={[
            { id: "1", tag: "Tv", icon: "tv" },
            { id: "2", tag: "Internet", icon: "web" }
          ]}
          location="Yasamal, Mirzə Şərifzadə 14"
          date={{ start: startDate, end: startDate.add.hours(2) }}
          phone="+994 55 555 55 55"
          status="done"
        />
      </BlockSection>

      <BlockSection title="Tədbirlər">
        <Event name="Tədbir adı" date={new Date()} />
      </BlockSection>
    </View.Scroll>
  );
}
