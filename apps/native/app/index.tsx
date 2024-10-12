import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";

import { AuthHttp, Block, Text, View, cn } from "@oneiro/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";

import { Tokens } from "../types/tokens";
import { cache } from "../utils/cache";

import logo from "../assets/images/logo.png";

export default function Index() {
  const profileMutation = useMutation({
    mutationKey: [cache.user.profile.$value],
    mutationFn: () => AuthHttp.instance().get("/accounts/profile/")
  });

  useEffect(() => {
    const authHttpSettings = AuthHttp.settings();

    authHttpSettings
      .setStorage(AsyncStorage)
      .setStorageTokenKeys({ access: Tokens.ACCESS_TOKEN, refresh: Tokens.REFRESH_TOKEN })
      .setRefreshUrl("/accounts/token/refresh/")
      .waitForToken({ timeout: 1e5 })
      .then(authHttpSettings.retrieveTokens())
      .then(profileMutation.mutateAsync)
      .then(() => router.replace("/(dashboard)"))
      .catch(() => router.replace("/welcome"));
  }, []);

  return (
    <View className={cn("flex items-center pt-60", "bg-primary h-full w-full")}>
      <Block className="flex items-center gap-8">
        <Image source={logo} style={{ width: 180, height: 169 }} />
        <Text className="text-4xl text-white">Digi Task</Text>
      </Block>
    </View>
  );
}
