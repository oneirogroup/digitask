import { Image } from "expo-image";
import { FC } from "react";
import { Text, View } from "react-native";

import { Block, Icon } from "@mdreal/ui-kit";

import { DateService } from "../../services/date-service";
import { BlockContainer } from "../blocks";
import { EventProps } from "./event.types";

import event from "../../assets/images/event.png";

export const Event: FC<EventProps> = ({ name, date }) => {
  return (
    <BlockContainer className="rounded-2xl p-6" gradient={{ from: "primary-50", to: "primary-50/60", sideTo: "lt" }}>
      <Block className="flex flex-row">
        <View className="flex flex-1 gap-4">
          <View className="flex flex-row gap-4">
            <Icon name="clock" variables={{ fill: "white" }} />
            <Text className="text-base text-white">{DateService.from(date).toLocaleDateString("az-AZ")}</Text>
          </View>
          <View>
            <Text className="text-2xl text-white">{name}</Text>
          </View>
        </View>

        <View>
          <Image source={event} style={{ width: 140, height: 140 }} />
        </View>
      </Block>

      <Block className="flex flex-row items-center justify-between">
        <Text className="text-xl text-white">Keçirələcəyi yer</Text>
        <Icon name="arrow-right" variables={{ fill: "white" }} />
      </Block>
    </BlockContainer>
  );
};
