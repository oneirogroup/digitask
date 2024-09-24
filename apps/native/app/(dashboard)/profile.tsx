import { router } from "expo-router";

import { Button, Text, View } from "@oneiro/ui-kit";
import AsyncStorageNative from "@react-native-async-storage/async-storage";

import { Tokens } from "../../types/tokens";

export default function Profile() {
  const logout = async () => {
    await AsyncStorageNative.removeItem(Tokens.ACCESS_TOKEN);
    await AsyncStorageNative.removeItem(Tokens.REFRESH_TOKEN);
    router.replace("/welcome");
  };

  return (
    <View>
      <Text>Hello, Profile!</Text>

      <Button onClick={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
