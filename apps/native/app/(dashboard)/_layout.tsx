import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { tasksAtom } from "@digitask/shared-lib";

import { ChatRoomHeaderRight, ChatRoomHeaderTitle } from "../../components/header/chat";
import { ProfileHeaderRight, ProfileHeaderTitle } from "../../components/header/profile";
import { TaskAddAttachmentHeaderRight } from "../../components/header/task/add-addition-header-right";
import { useTasksInit } from "../../hooks/use-tasks-init";
import { useWebsocketInit } from "../../hooks/use-websocket-init";
import { TaskType } from "../../types/task-type";

import "../main.css";

export default function DashboardLayout() {
  useWebsocketInit();
  useTasksInit(TaskType.Connection);
  useTasksInit(TaskType.Problem);

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(chat)/chat" options={{ title: "Söhbətlər", headerBackButtonDisplayMode: "minimal" }} />
      <Stack.Screen
        name="(chat)/[chatRoomId]"
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerTitle: () => <ChatRoomHeaderTitle />,
          headerRight: () => <ChatRoomHeaderRight />
        }}
      />

      <Stack.Screen
        name="(profile)/profile-data"
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerTitle: () => <ProfileHeaderTitle />,
          headerRight: () => <ProfileHeaderRight />
        }}
      />

      <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackButtonDisplayMode: "minimal" }} />

      <Stack.Screen
        name="(task)/[taskId]/task-type/[taskType]/index"
        options={{
          title: "Tapşırıq",
          headerBackButtonDisplayMode: "minimal"
        }}
      />
      <Stack.Screen
        name="(task)/[taskId]/task-type/[taskType]/type/[type]"
        options={{
          title: "Tapşırıq",
          presentation: "modal",
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => <TaskAddAttachmentHeaderRight />
        }}
      />
      <Stack.Screen
        name="(task)/[taskId]/products"
        options={{
          title: "Məhsul əlavə et",
          presentation: "modal",
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => <TaskAddAttachmentHeaderRight />
        }}
      />
      <Stack.Screen
        name="(task)/[taskId]/add-product"
        options={{
          title: "Məhsul əlavə et",
          presentation: "modal",
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => <TaskAddAttachmentHeaderRight />
        }}
      />
    </Stack>
  );
}
