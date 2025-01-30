import { getCurrentPositionAsync } from "expo-location";
import { usePathname } from "expo-router";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  Backend,
  fields,
  notificationAtom,
  profileAtom,
  signInAtom,
  useReceiveMessage,
  useRecoilArrayControls
} from "@digitask/shared-lib";
import { AuthHttp, logger } from "@mdreal/ui-kit";
import { useWebsocket } from "@mdreal/ws-client";

import { env } from "../env-schema";
import { requestLocationPermission } from "../utils/request-location-permission";
import { useShowMessageNotification } from "./use-show-message-notification";

const wsUrl = new URL(env.EXPO_PUBLIC_API_URL);
const protocol = wsUrl.protocol.startsWith("https") ? "wss" : "ws";
wsUrl.protocol = protocol;
const wsHostUrl = wsUrl.toString().slice(0, -1);

export const useWebsocketInit = () => {
  const pathname = usePathname();
  const notificationControls = useRecoilArrayControls(notificationAtom);
  const receiveMessage = useReceiveMessage();
  const profileData = useRecoilValue(profileAtom);
  const [signInData, setSignInData] = useRecoilState(signInAtom);

  const showMessageNotification = useShowMessageNotification();

  useWebsocket<Backend.Message>(
    fields.chat.toString(),
    `${wsHostUrl}/chat/?email=${profileData?.email}&token=${signInData?.access_token}`,
    {
      onConnect() {
        logger.debug(
          "digitask.native:hooks:use-websocket-init",
          `${wsHostUrl}/chat/?email=${profileData?.email}&token=${signInData?.access_token}`
        );
      },
      onError(error) {
        logger.debug("digitask.native:hooks:use-websocket-init:error", error);
      },
      onMessage(message) {
        if (typeof message === "object") {
          if ("email" in message) {
            logger.debug("digitask.native:hooks:use-websocket-init:logger-user-email", message.email);
          }

          if ("room" in message) {
            receiveMessage(message);

            if (!(message.typeM === "sent" || pathname.startsWith("/room/"))) {
              showMessageNotification(message);
            }
          }
        }
      },
      onDisconnect() {
        AuthHttp.instance()
          .refreshToken()
          .then(data => {
            const access_token = data?.access;
            const refresh_token = data?.refresh;
            if (!data || !access_token || !refresh_token) return;
            setSignInData(prev => (prev === null ? prev : { ...prev, access_token, refresh_token }));
          });
      }
    },
    [pathname]
  );

  useWebsocket(fields.location, `${wsHostUrl}/ws/?email=${profileData?.email}&token=${signInData?.access_token}`, {
    async onConnect() {
      logger.log("digitask.native:hooks:use-websocket-init:ws:connected");
      await requestLocationPermission();
      logger.log("digitask.native:hooks:use-websocket-init:ws:location-permission-granted");
      const sendLocation = async () => {
        const position = await getCurrentPositionAsync({});
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        this.send(location);
      };
      setInterval(sendLocation, 5 * 1e3);
      await sendLocation();
    }
  });

  useWebsocket<{ message: Backend.NotificationMessage[] }>(
    fields.notification,
    `${wsHostUrl}/notification/?email=${profileData?.email}&token=${signInData?.access_token}`,
    {
      onConnect() {},
      onMessage(data) {
        data.message.forEach(notification => notificationControls.add(notification));
      },
      onDisconnect() {
        notificationControls.clear();
      }
    }
  );
};
