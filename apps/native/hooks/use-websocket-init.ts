import { useRecoilState, useRecoilValue } from "recoil";

import { Backend, fields, profileAtom, signInAtom, useReceiveMessage } from "@digitask/shared-lib";
import { AuthHttp } from "@mdreal/ui-kit";
import { useListen, useWebsocket } from "@mdreal/ws-client";

export const useWebsocketInit = () => {
  const receiveMessage = useReceiveMessage();
  const profileData = useRecoilValue(profileAtom);
  const [signInData, setSignInData] = useRecoilState(signInAtom);

  useWebsocket(
    fields.chat.toString(),
    `ws://135.181.42.192/chat/?email=${profileData?.email}&token=${signInData?.access_token}`
  );
  useListen<Backend.Message>(fields.chat.toString(), {
    onMessage(message) {
      // @ts-ignore
      if (message.user === "user auth deyil") {
        AuthHttp.instance()
          .refreshToken()
          .then((data: any) => {
            setSignInData(data);
          });
      }

      if ("room" in message) {
        receiveMessage(message.room, message);
      }
    }
  });
};
