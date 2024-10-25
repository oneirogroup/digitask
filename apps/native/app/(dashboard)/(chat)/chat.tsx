import { Text, View } from "react-native";

import { api } from "@digitask/shared-lib/api";
import { RoomsApiViewAtom } from "@digitask/shared-lib/atoms/backend/accounts/RoomsApiView";
import { useRecoilQuery } from "@digitask/shared-lib/hooks/use-recoil-query";
import { fields } from "@digitask/shared-lib/utils/fields";
import { Block, If, Input } from "@mdreal/ui-kit";

import { ChatRoom } from "../../../components/chat";

export default function Chat() {
  const { data: rooms = [], isPending } = useRecoilQuery(RoomsApiViewAtom, {
    queryKey: [fields.user.profile.chat.rooms],
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
