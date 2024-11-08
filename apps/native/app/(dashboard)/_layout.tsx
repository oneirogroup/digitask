import { Stack } from "expo-router";

import { ChatRoomHeaderRight, ChatRoomHeaderTitle } from "../../components/header/chat";
import { ProfileHeaderRight, ProfileHeaderTitle } from "../../components/header/profile";
import { TaskAddAttachmentHeaderRight } from "../../components/header/task/add-addition-header-right";
import { useTasksInit } from "../../hooks/use-tasks-init";
import { useWebsocketInit } from "../../hooks/use-websocket-init";

import "../main.css";

export default function DashboardLayout() {
  useWebsocketInit();
  useTasksInit();

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

      <Stack.Screen name="(task)/[taskId]/index" options={{ title: "Tapşırıq", headerBackTitleVisible: false }} />
      <Stack.Screen
        name="(task)/[taskId]/type/[type]"
        options={{
          title: "Tapşırıq",
          headerBackTitleVisible: false,
          presentation: "modal",
          headerRight: () => <TaskAddAttachmentHeaderRight />
        }}
      />
    </Stack>
  );
}
