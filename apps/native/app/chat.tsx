import { Text, View } from "react-native";

import { Block, Input } from "@oneiro/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { ProfileData } from "../types/backend/profile-data";
import { cache } from "../utils/cache";

interface Message {}

export default function Chat() {
  const { data } = useQuery<ProfileData>({ queryKey: [cache.user.profile.$value] });
  if (!data) return null;
  // const tokens = AuthHttp.settings().getTokens();
  // logger.debug("digitask.native:chat:url", `ws://135.181.42.192/chat/?email=${data.email}&token=${tokens.access}`);
  // useWebsocket("chat", `ws://135.181.42.192/chat/?email=${data.email}&token=${tokens.access}`);
  // const messages = useListen<Message, true>("chat", true);

  return (
    <Block.Scroll>
      <View className="px-6 py-3">
        <Input
          placeholder="Axtar"
          variant="secondary"
          className="placeholder:text-neutral"
          icon={{ left: "search", right: "filter" }}
        />
      </View>
      <Block className="px-4 py-3">
        <View className="flex flex-row items-center gap-4">
          <View className="bg-neutral-95 flex h-12 w-12 items-center justify-center rounded-full">
            <Text className="text-primary">E</Text>
          </View>
          <View className="flex flex-1 gap-2">
            <View className="flex flex-row justify-between">
              <Text>Elmar Hasanov</Text>
              <Text className="text-neutral-20">12m</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-neutral">Sualim var</Text>
              <View className="bg-success-60 flex h-5 w-5 items-center justify-center rounded-full text-white">
                <Text className="text-xs text-white">2</Text>
              </View>
            </View>
          </View>
        </View>
      </Block>
    </Block.Scroll>
  );
}
