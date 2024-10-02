import { Stack } from "expo-router";

import { AuthHttp, TailwindConfigProvider, logger } from "@oneiro/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { isDev } from "../const";
import { Tokens } from "../types/tokens";

import "./main.css";

logger.setLogLevel(isDev ? "debug" : "log");
AuthHttp.waitForToken({ timeout: 1e5 })
  .then(() => AsyncStorage.getItem(Tokens.ACCESS_TOKEN))
  .then(AuthHttp.setToken)
  .catch(AuthHttp.stopWaiting);

export default function RootLayout() {
  return (
    <TailwindConfigProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false, freezeOnBlur: false }} />
      </Stack>
    </TailwindConfigProvider>
  );
}
