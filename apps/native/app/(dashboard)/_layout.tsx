import { Stack } from "expo-router";

import { ChatRoomHeaderRight, ChatRoomHeaderTitle } from "../../components/header/chat";
import { ProfileHeaderRight, ProfileHeaderTitle } from "../../components/header/profile";
import { TaskAddAdditionHeaderRight } from "../../components/header/task/add-addition-header-right";
import { useWebsocketInit } from "../../hooks/use-websocket-init";

import "../main.css";

export default function DashboardLayout() {
  useWebsocketInit();

  return (
    <Stack initialRouteName="(tabs)">
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

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="[taskId]/index" options={{ title: "Tapşırıq", headerBackTitleVisible: false }} />
      <Stack.Screen
        name="[taskId]/add-task-addition"
        options={{
          title: "Tapşırıq",
          headerBackTitleVisible: false,
          presentation: "modal",
          headerRight: () => <TaskAddAdditionHeaderRight />
        }}
      />
    </Stack>
  );
}
