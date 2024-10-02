import { Block, Icon, Text, View, logger } from "@oneiro/ui-kit";

import { palette } from "../../../../palette";
import { BlockContainer, BlockSection } from "../../components/blocks";
import { Event } from "../../components/event";
import { DateService } from "../../services/date-service";

logger.disable();

export default function Index() {
  const date = new DateService();
  const formattedDate = date.format("dd MM");

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
        <BlockContainer>
          <Text>Ayxan O. ve s. WIP... Task</Text>
        </BlockContainer>
      </BlockSection>

      <BlockSection title="Tədbirlər">
        <Event />
      </BlockSection>
    </View.Scroll>
  );
}
