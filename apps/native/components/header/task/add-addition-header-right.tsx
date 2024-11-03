import { FC } from "react";
import { View } from "react-native";

import { Icon } from "@mdreal/ui-kit";

export const TaskAddAdditionHeaderRight: FC = () => {
  return (
    <View>
      <Icon name="three-dots" variables={{ stroke: "black" }} />
    </View>
  );
};
