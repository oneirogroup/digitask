import { useEffect } from "react";

import { WebsocketClient } from "../utils/websocket-client";
import { UseWebsocketProps } from "./use-websocket.types";

export const useWebsocket = <TData>(
  name: string,
  url?: string,
  options?: UseWebsocketProps<TData>
): WebsocketClient | undefined => {
  useEffect(() => {
    if (url && !WebsocketClient.has(name)) {
      const client = WebsocketClient.instance(name, url);
      if (!client) return;

      client.on("connect", options?.onConnect?.bind(client));
      client.on("message", options?.onMessage?.bind(client));
      client.on("error", options?.onError?.bind(client));
      client.on("disconnect", options?.onDisconnect?.bind(client));
    }

    return () => {
      if (WebsocketClient.has(name)) {
        WebsocketClient.get(name)?.close();
        WebsocketClient.remove(name);
      }
    };
  }, []);

  return WebsocketClient.instance(name);
};
