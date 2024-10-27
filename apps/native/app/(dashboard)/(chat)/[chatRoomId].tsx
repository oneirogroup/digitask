import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { api } from "@digitask/shared-lib/api";
import { profileAtom } from "@digitask/shared-lib/atoms/backend/accounts/profile";
import { fields } from "@digitask/shared-lib/utils/fields";
import { Block } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { Message } from "../../../components/chat";

export default function Chat() {
  const { chatRoomId } = useLocalSearchParams();
  if (!chatRoomId) {
    return (
      <View>
        <Text>Room not found</Text>
      </View>
    );
  }

  const userProfile = useRecoilValue(profileAtom);
  if (!userProfile) return null;

  const { data: previousMessages } = useQuery({
    queryKey: [fields.user.profile.chat.messages],
    queryFn: () => api.accounts.messages.$get({ room: +chatRoomId })
  });

  console.log("currentUserId", userProfile.id);
  console.log("previousMessages", previousMessages);

  return (
    <Block.Scroll>
      {previousMessages?.results?.map(message => <Message key={message.id} message={message} />)}

      {/*<View className="px-6 py-3">*/}
      {/*  <Input*/}
      {/*    placeholder="Axtar"*/}
      {/*    variant="secondary"*/}
      {/*    className="placeholder:text-neutral"*/}
      {/*    icon={{ left: "search", right: "filter" }}*/}
      {/*  />*/}
      {/*</View>*/}
      {/*<Block className="flex">*/}
      {/*  <If condition={isPending}>*/}
      {/*    <If.Then>*/}
      {/*      <Text>Loading...</Text>*/}
      {/*    </If.Then>*/}
      {/**/}
      {/*    <If.Else>*/}
      {/*      {rooms.map(room => (*/}
      {/*        <ChatRoom key={room.id} room={room} />*/}
      {/*      ))}*/}
      {/*    </If.Else>*/}
      {/*  </If>*/}
      {/*</Block>*/}
    </Block.Scroll>
  );
}
