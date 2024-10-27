import { Stack } from "expo-router";

import { ChatRoomHeaderRight, ChatRoomHeaderTitle } from "../../components/header/chat";
import { ProfileHeaderRight, ProfileHeaderTitle } from "../../components/header/profile";

import "../main.css";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="(chat)/chat" options={{ title: "Chat", headerBackTitleVisible: false }} />
      <Stack.Screen
        name="(chat)/[chatRoomId]"
        options={{
          headerBackVisible: true,
          headerBackTitleVisible: false,
          headerTitle: () => <ChatRoomHeaderTitle />,
          headerRight: () => <ChatRoomHeaderRight />
        }}
      />

      <Stack.Screen
        name="(profile)/profile-data"
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => <ProfileHeaderTitle />,
          headerRight: () => <ProfileHeaderRight />
        }}
      />
    </Stack>
  );
}
