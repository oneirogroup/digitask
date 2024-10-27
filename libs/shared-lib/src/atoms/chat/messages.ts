import { atom, atomFamily, selector } from "recoil";

import { Backend } from "../../types";
import { fields } from "../../utils";

export const messagesMapAtom = atomFamily<Backend.Message[], string>({
  key: fields.chat.messages.all.toString(),
  default: []
});

export const activeChatRoomIdAtom = atom<string | null>({
  key: fields.chat.rooms.active.toString(),
  default: null
});

export const activeChatRoomMessagesAtom = selector({
  key: fields.chat.messages.active.toString(),
  get: ({ get }) => {
    const chatRoomId = get(activeChatRoomIdAtom);
    if (!chatRoomId) return [];
    return get(messagesMapAtom(chatRoomId));
  }
});
