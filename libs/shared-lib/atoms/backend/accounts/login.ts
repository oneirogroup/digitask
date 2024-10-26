import { atom } from "recoil";

import { AuthToken } from "../../../types/backend/auth-token";
import { fields } from "../../../utils/fields";

export const signInAtom = atom<AuthToken | null>({
  key: fields.user.profile.toString(),
  default: null
});
