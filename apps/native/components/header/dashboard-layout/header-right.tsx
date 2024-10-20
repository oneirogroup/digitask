import { useNavigation } from "expo-router";
import { FC } from "react";
import { Pressable } from "react-native";

import { Block, Icon } from "@oneiro/ui-kit";

export const HeaderRight: FC = () => {
  const navigation = useNavigation("/dashboard");

  const redirect = () => {
    // @ts-ignore
    navigation.navigate("(chat)");
  };

  return (
    <Block className="flex flex-row items-center justify-end gap-4 pr-4">
      <Pressable onPress={redirect}>
        <Icon name="chat" variables={{ stroke: "#005ABF" }} />
      </Pressable>
      <Icon name="notifications" variables={{ stroke: "#005ABF", checkmark: "none" }} />
    </Block>
  );
};
