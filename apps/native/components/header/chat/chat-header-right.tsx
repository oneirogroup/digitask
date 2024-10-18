import { FC } from "react";
import { View } from "react-native";

import { Icon } from "@oneiro/ui-kit";

export const ChatHeaderRight: FC = () => {
  return (
    <View>
      <Icon name="three-dots" variables={{ stroke: "black" }} />
    </View>
  );
};
