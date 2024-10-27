import { atom } from "recoil";

import { AuthToken } from "../../../types/backend";
import { fields } from "../../../utils";

export const signInAtom = atom<AuthToken | null>({
  key: fields.user.profile.toString(),
  default: null
});
