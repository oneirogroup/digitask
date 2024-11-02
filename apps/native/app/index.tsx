import { Image } from "expo-image";
import { router } from "expo-router";
import { api } from "libs/shared-lib/src/api";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { fields, profileAtom, useRecoilQuery } from "@digitask/shared-lib";
import { Block, cn } from "@mdreal/ui-kit";

import logo from "../assets/images/logo.png";

export default function Index() {
  const { isSuccess, isError } = useRecoilQuery(profileAtom, {
    queryKey: [fields.user.profile],
    queryFn: () => api.accounts.profile.$get,
    retry: false,
    isNullable: true
  });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(router.push, 200, "/(dashboard)/(chat)/1");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      router.replace("/(auth)/sign-in");
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
