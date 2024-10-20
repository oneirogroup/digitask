import { Stack } from "expo-router";

import { Providers } from "../components/providers";

import "./main.css";

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />

        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
