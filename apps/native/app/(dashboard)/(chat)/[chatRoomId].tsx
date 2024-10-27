import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { activeChatRoomMessagesAtom, profileAtom, useSendMessage } from "@digitask/shared-lib";
import { Block } from "@mdreal/ui-kit";

import { Message } from "../../../components/chat";

export default function Chat() {
  const { chatRoomId } = useLocalSearchParams<{ chatRoomId: string }>();

  const userProfile = useRecoilValue(profileAtom);
  const messages = useRecoilValue(activeChatRoomMessagesAtom);
  const sendMessage = useSendMessage();

  if (!chatRoomId || !userProfile) {
    return (
      <View>
        <Text>Room not found</Text>
      </View>
    );
  }

  return (
    <Block.Scroll>
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}

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
