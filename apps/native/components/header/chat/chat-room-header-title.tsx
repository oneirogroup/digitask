import { useLocalSearchParams } from "expo-router";
import { FC } from "react";
import { Text, View } from "react-native";

import { Block } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { ChatRoom } from "../../../types/backend/chat-room";
import { fields } from "../../../utils/fields";

export const ChatRoomHeaderTitle: FC = () => {
  const { chatRoomId } = useLocalSearchParams();
  if (!chatRoomId) return null;

  const { data: room } = useQuery({
    queryKey: [fields.user.profile.chat.rooms],
    select: (rooms: ChatRoom[]) => rooms.find(room => room.id === +chatRoomId)
  });
  if (!room) return null;

  return (
    <Block className="flex flex-row items-center gap-4 px-2">
      <View className="bg-neutral-95 flex h-12 w-12 items-center justify-center rounded-full">
        <Text className="text-primary">{room.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View className="flex flex-1 gap-1">
        <View className="flex flex-row justify-between">
          <Text>{room.name}</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <View className="bg-success h-3 w-3 rounded-full" />
          <Text className="text-neutral line-clamp-1">Online</Text>
        </View>
      </View>
    </Block>
  );
};
