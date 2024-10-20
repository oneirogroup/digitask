import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" redirect />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(chat)" options={{}} />
    </Stack>
  );
}
