import { FC } from "react";
import { Text, View } from "react-native";

import { DateService } from "@digitask/shared-lib/services/date-service";
import { Block } from "@mdreal/ui-kit";

import { MessageProps } from "./message.types";

export const Message: FC<MessageProps> = ({ message }) => {
  const now = DateService.from();
  const messageDate = DateService.from(message.timestamp);
  const diff = now.diff(messageDate);

  return (
    <Block>
      <View>
        <Text>{message.content}</Text>
        <Text>{messageDate.format("HH MM DD YYYY ss mm")}</Text>
      </View>
    </Block>
  );
};
