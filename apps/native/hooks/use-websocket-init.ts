import { useRecoilState, useRecoilValue } from "recoil";

import { Backend, fields, profileAtom, signInAtom, useReceiveMessage } from "@digitask/shared-lib";
import { AuthHttp, logger } from "@mdreal/ui-kit";
import { useWebsocket } from "@mdreal/ws-client";

export const useWebsocketInit = () => {
  const receiveMessage = useReceiveMessage();
  const profileData = useRecoilValue(profileAtom);
  const [signInData, setSignInData] = useRecoilState(signInAtom);

  useWebsocket<Backend.Message>(
    fields.chat.toString(),
    `ws://135.181.42.192/chat/?email=${profileData?.email}&token=${signInData?.access_token}`,
    {
      onConnect() {
        logger.debug(
          "digitask.native:hooks:use-websocket-init",
          `ws://135.181.42.192/chat/?email=${profileData?.email}&token=${signInData?.access_token}`
        );
      },
      onError(error) {
        logger.debug("digitask.native:hooks:use-websocket-init:error", error);
      },
      onMessage(message) {
        logger.debug("digitask.native:hooks:use-websocket-init:message", message);
        logger.debug("digitask.native:hooks:use-websocket-init:message-type", typeof message);

        if (typeof message === "object") {
          if ("email" in message) {
            logger.debug("digitask.native:hooks:use-websocket-init:logger-user-email", message.email);
          }

          if ("room" in message) {
            receiveMessage(message);
          }
        }
      },
      onDisconnect() {
        logger.debug("digitask.native:hooks:use-websocket-init:disconnected");

        AuthHttp.instance()
          .refreshToken()
          .then(data => {
            const access_token = data?.access;
            const refresh_token = data?.refresh;
            if (!data || !access_token || !refresh_token) return;
            setSignInData(prev => (prev === null ? prev : { ...prev, access_token, refresh_token }));
          });
      }
    }
  );
};
