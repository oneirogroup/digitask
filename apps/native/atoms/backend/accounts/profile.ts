import { atom } from "recoil";

import { ProfileData } from "../../../types/backend/profile-data";
import { fields } from "../../../utils/fields";

export const profileAtom = atom<ProfileData | null>({
  key: fields.user.profile.toString(),
  default: null
});
