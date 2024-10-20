import { FC } from "react";
import { Text, View } from "react-native";

import { Block } from "@oneiro/ui-kit";

import { DateService } from "../../services/date-service";
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
