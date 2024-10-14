import { Stack } from "expo-router";

import { Providers } from "../components/providers";

import "./main.css";

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="chat" options={{ freezeOnBlur: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false, freezeOnBlur: false }} />
      </Stack>
    </Providers>
  );
}
