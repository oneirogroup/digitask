import { useRecoilCallback } from "recoil";

import { messagesAtom } from "../../atoms";
import { Message } from "../../types/backend";

export const useSendMessage = () => {
  return useRecoilCallback(({ set }) => {
    return (chatId: number, message: Message) => {
      set(messagesAtom(chatId), messages => {
        messages.results.push(message);
        return messages;
      });
    };
  });
};
