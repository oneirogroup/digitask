import { useRecoilCallback } from "recoil";

import { messagesMapAtom } from "../../atoms";
import { Message } from "../../types/backend";

export const useSendMessage = () => {
  return useRecoilCallback(({ set }) => {
    return (chatId: string, content: Message) => {
      set(messagesMapAtom(chatId), oldMessages => [...oldMessages, content]);
    };
  });
};
