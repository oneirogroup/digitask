import { atom } from "recoil";

import { Backend } from "../types";
import { fields } from "../utils/fields";

export const notificationAtom = atom<Backend.NotificationMessage[]>({
  key: fields.notification,
  default: []
});
