import { Stack } from "expo-router";

import { Providers } from "@digitask/shared-lib";

import { useDev } from "../hooks/use-dev";

import "./main.css";

export default function RootLayout() {
  useDev();

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />

        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />
      </Stack>
    </Providers>
  );
}
