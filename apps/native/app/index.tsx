import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { AuthHttp, Block, cn } from "@mdreal/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../api";
import { profileAtom } from "../atoms/backend/accounts/profile";
import { useRecoilQuery } from "../hooks/use-recoil-query";
import { Tokens } from "../types/tokens";
import { env } from "../utils/env";
import { fields } from "../utils/fields";

import logo from "../assets/images/logo.png";

const authHttpSettings = AuthHttp.settings();

authHttpSettings
  .setBaseUrl(env.EXPO_PUBLIC_API_URL)
  .setStorage(AsyncStorage)
  .setStorageTokenKeys({ access: Tokens.ACCESS_TOKEN, refresh: Tokens.REFRESH_TOKEN })
  .setRefreshUrl("/accounts/token/refresh/")
  .waitForToken({ timeout: 1e5 })
  .then(authHttpSettings.retrieveTokens());

export default function Index() {
  const { isSuccess, isError } = useRecoilQuery(profileAtom, {
    queryKey: [fields.user.profile.toString()],
    queryFn: () => api.accounts.profile.$get,
    retry: false
  });

  useEffect(() => {
    if (isSuccess) {
      router.replace("/(dashboard)");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      router.replace("/welcome");
    }
  }, [isError]);

  return (
    <View className={cn("flex items-center pt-60", "bg-primary h-full w-full")}>
      <Block className="flex items-center gap-8">
        <Image source={logo} style={{ width: 180, height: 169 }} />
        <Text className="text-4xl text-white">Digi Task</Text>
      </Block>
    </View>
  );
}
