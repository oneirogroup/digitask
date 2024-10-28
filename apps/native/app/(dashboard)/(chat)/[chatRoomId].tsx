import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Text,
  View
} from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  Backend,
  activeChatRoomMessagesSelector,
  activeChatRoomPageAtom,
  activeChatRoomPageSizeAtom,
  activeChatRoomPaginationSelector,
  api,
  defaultMessagesSize,
  fields,
  messagesAtom,
  profileAtom,
  useDebounceFn,
  useRecoilQuery,
  useSendMessage
} from "@digitask/shared-lib";
import { Button, Icon, Input, cn } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { BlockContainer } from "../../../components/blocks";

const renderMessageItem: ListRenderItem<Backend.Message> = ({ item: message }) => {
  const isMe = message.typeM === "sent";
  return (
    <View className={cn("my-2 max-w-[70%] rounded-xl p-3", isMe ? "self-end bg-[#DCF8C6]" : "self-start bg-[#ECECEC]")}>
      <Text className="text-base">{message.content}</Text>
    </View>
  );
};

export default function Chat() {
  const { chatRoomId } = useLocalSearchParams<{ chatRoomId: string }>();
  const [input, setInput] = useState<string | null>(null);
  const profile = useRecoilValue(profileAtom);
  const [page, setPage] = useRecoilState(activeChatRoomPageAtom);
  const size = useRecoilValue(activeChatRoomPageSizeAtom);
  const [pagination, setPagination] = useRecoilState(activeChatRoomPaginationSelector);
  const [messages, setMessages] = useRecoilState(activeChatRoomMessagesSelector);

  useRecoilQuery(messagesAtom(+chatRoomId), {
    queryKey: [fields.chat.messages],
    queryFn: () => api.accounts.messages.$get({ room: +chatRoomId, page: 1, size: defaultMessagesSize }),
    enabled: !!chatRoomId
  });

  const fetchMessagesMutation = useMutation({
    mutationKey: [fields.chat.messages, page],
    mutationFn: () => api.accounts.messages.$get({ room: +chatRoomId, page, size })
  });

  const loadMoreMessages = useDebounceFn(async () => {
    console.log("pagination", pagination.next);
    if (!pagination.next) return;
    const url = new URL(pagination.next);
    const nextPage = +url.searchParams.get("page")!;
    setPage(nextPage);
    const oldMessages = await fetchMessagesMutation.mutateAsync();
    setMessages(messages => [...messages, ...oldMessages.results]);
    setPagination(pagination => ({ ...pagination, next: oldMessages.next }));
  }, 200);

  const sendMessage = useSendMessage();

  const handleSendMessage = () => {
    if (!input || !profile) return;
    const newDummyMessage: Backend.Message = {
      id: messages.length + 1,
      content: input,
      typeM: "sent",
      room: +chatRoomId,
      user: profile,
      timestamp: new Date().toISOString()
    };
    sendMessage(newDummyMessage.room, newDummyMessage);
    setInput(null);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;

    if (offsetY + height > event.nativeEvent.contentSize.height) {
      loadMoreMessages();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 px-4"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={message => message.id.toString()}
        renderItem={renderMessageItem}
        inverted
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View className="px-4 pb-8 pt-2">
        <BlockContainer className="border-neutral-90 flex flex-row items-center justify-between gap-4 border-2">
          <View className="flex-1">
            {/* @ts-ignore */}
            <Input className="border-transparent" placeholder="Mesaj yaz..." value={input} onChange={setInput} />
          </View>
          <Button variant="none" onClick={handleSendMessage}>
            <Icon name="send" state="digitask" />
          </Button>
        </BlockContainer>
      </View>
    </KeyboardAvoidingView>
  );
}
