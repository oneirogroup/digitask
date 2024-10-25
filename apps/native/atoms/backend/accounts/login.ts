import { atom } from "recoil";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthToken } from "../../../types/backend/auth-token";
import { NullableFields } from "../../../types/nullable";
import { Tokens } from "../../../types/tokens";
import { fields } from "../../../utils/fields";

export const tokenAtom = atom<NullableFields<Pick<AuthToken, "access_token" | "refresh_token">>>({
  key: fields.user.profile.tokens.toString(),
  effects: [
    ({ onSet }) => {
      onSet(async value => {
        value?.access_token
          ? await AsyncStorage.setItem(Tokens.ACCESS_TOKEN, value.access_token)
          : await AsyncStorage.removeItem(Tokens.ACCESS_TOKEN);
        value?.refresh_token
          ? await AsyncStorage.setItem(Tokens.REFRESH_TOKEN, value.refresh_token)
          : await AsyncStorage.removeItem(Tokens.REFRESH_TOKEN);
      });
    }
  ],
  default: (async () => {
    const token = await AsyncStorage.getItem(Tokens.ACCESS_TOKEN);
    const refreshToken = await AsyncStorage.getItem(Tokens.REFRESH_TOKEN);
    return { access_token: token, refresh_token: refreshToken };
  })()
});
