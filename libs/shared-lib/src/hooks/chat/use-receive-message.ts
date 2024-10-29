import { useRecoilCallback } from "recoil";

import { messagesAtom } from "../../atoms";
import { Message } from "../../types/backend";

export const useReceiveMessage = () => {
  return useRecoilCallback(({ set }) => (chatId: number, message: Message) => {
    set(messagesAtom(chatId), oldMessages => {
      oldMessages.results.push(message);
      return oldMessages;
    });
  });
};
