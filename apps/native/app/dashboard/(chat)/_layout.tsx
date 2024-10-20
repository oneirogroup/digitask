import { Stack } from "expo-router";

import { ChatRoomHeaderRightTitle, ChatRoomHeaderTitle } from "../../../components/header/chat";

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" redirect />
      <Stack.Screen name="chat" />
      <Stack.Screen
        name="[roomId]"
        options={({ route }) => ({
          headerBackVisible: true,
          headerBackTitleVisible: false,
          // @ts-ignore
          headerTitle: () => <ChatRoomHeaderTitle roomId={route.params?.roomId} />,
          headerRight: ChatRoomHeaderRightTitle
        })}
      />
    </Stack>
  );
}
