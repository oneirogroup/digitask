import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";

import { Block, Text, View, cn } from "@oneiro/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Tokens } from "../types/tokens";
import { sleep } from "../utils/sleep";

import logo from "../assets/images/logo.png";

export default function Index() {
  useEffect(() => {
    sleep(1)
      .then(() => AsyncStorage.getItem(Tokens.ACCESS_TOKEN))
      .then(token => {
        if (!token) return Promise.reject();
      })
      .catch(() => router.replace("/welcome"));
  }, []);

  return (
    <View className={cn("bg-primary h-full w-full", "flex items-center pt-60")}>
      <Block className="flex items-center gap-8">
        <Image source={logo} style={{ width: 180, height: 169 }} />
        <Text className="text-4xl text-white">Digi Task</Text>
      </Block>
    </View>
  );
}
