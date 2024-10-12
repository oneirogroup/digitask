import { Stack } from "expo-router";

import { AuthHttp } from "@oneiro/ui-kit";

import { env } from "../../utils/env";

AuthHttp.settings().setBaseUrl(env.EXPO_PUBLIC_API_URL);

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false, freezeOnBlur: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false, freezeOnBlur: false }} />
      <Stack.Screen name="code" options={{ headerShown: false, freezeOnBlur: false }} />
    </Stack>
  );
}
