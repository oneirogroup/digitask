import { Text, View } from "react-native";

import { AuthHttp, Input, logger } from "@oneiro/ui-kit";
import { useListen, useWebsocket } from "@oneiro/ws-client";
import { useQuery } from "@tanstack/react-query";

import { ProfileData } from "../types/backend/profile-data";
import { cache } from "../utils/cache";

interface Message {}

export default function Chat() {
  const { data } = useQuery<ProfileData>({ queryKey: [cache.user.profile.$value], initialData: {} as any });
  const tokens = AuthHttp.settings().getTokens();

  logger.debug("digitask.native:chat:url", `ws://135.181.42.192/chat/?email=${data.email}&token=${tokens.access}`);
  useWebsocket("chat", `ws://135.181.42.192/chat/?email=${data.email}&token=${tokens.access}`);
  const messages = useListen<Message, true>("chat", true);

  return (
    <View>
      <Text>Chat</Text>

      <Input />
      <View></View>
    </View>
  );
}
