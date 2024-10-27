import { ProfileData } from "libs/shared-lib/types/backend/profile-data";
import { fields } from "libs/shared-lib/utils/fields";
import { atom } from "recoil";

export const profileAtom = atom<ProfileData | null>({
  key: fields.user.profile.toString(),
  default: null
});
