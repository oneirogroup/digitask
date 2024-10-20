import { FC } from "react";
import { Text, View } from "react-native";

import { Icon } from "@oneiro/ui-kit";

export const ChatRoomHeaderRightTitle: FC = () => {
  return (
    <View>
      <Icon name="three-dots" variables={{ stroke: "black" }} />
    </View>
  );
};
