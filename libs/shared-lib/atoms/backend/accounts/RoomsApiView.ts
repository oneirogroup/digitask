import { atom } from "recoil";

import { ChatRoom } from "../../../types/backend/chat-room";
import { fields } from "../../../utils/fields";

export const RoomsApiViewAtom = atom<ChatRoom[]>({
  key: fields.user.profile.chat.rooms,
  default: []
});
