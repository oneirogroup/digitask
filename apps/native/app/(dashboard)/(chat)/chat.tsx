import { Text, View } from "react-native";

import { Block, If, Input } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../api";
import { ChatRoom } from "../../../components/chat";
import { cache } from "../../../utils/cache";

export default function Chat() {
  const { data: rooms = [], isPending } = useQuery({
    queryKey: [cache.user.profile.chat.rooms],
    queryFn: () => api.accounts.RoomsApiView.$get
  });

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
      <Block className="flex">
        <If condition={isPending}>
          <If.Then>
            <Text>Loading...</Text>
          </If.Then>

          <If.Else>
            {rooms.map(room => (
              <ChatRoom key={room.id} room={room} />
            ))}
          </If.Else>
        </If>
      </Block>
    </Block.Scroll>
  );
}
