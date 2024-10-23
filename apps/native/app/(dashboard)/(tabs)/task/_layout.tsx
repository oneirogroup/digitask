import { Stack } from "expo-router";

import { Block } from "@mdreal/ui-kit";

export default function DashboardLayout() {
  return (
    <Block.Fade>
      <Stack initialRouteName="(sections)">
        <Stack.Screen name="(sections)" options={{ headerShown: false }} />
        <Stack.Screen name="[taskId]" options={{ title: "Tapşırıq" }} />
      </Stack>
    </Block.Fade>
  );
}
