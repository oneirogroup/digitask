import { UseWebsocketProps } from "../hooks/use-websocket.types";
import { WebsocketClient } from "./websocket-client";

export const getOrCreateWSClient = (
  name: string,
  url?: string,
  options?: UseWebsocketProps<any>
): { client?: WebsocketClient; unsubscribe(): void } | undefined => {
  if (url && !WebsocketClient.has(name)) {
    const client = WebsocketClient.instance(name, url);
    if (!client) return;

    client.on("connect", options?.onConnect?.bind(client));
    client.on("message", options?.onMessage?.bind(client));
    client.on("error", options?.onError?.bind(client));
    client.on("disconnect", options?.onDisconnect?.bind(client));
  }

  return {
    client: WebsocketClient.get(name) as WebsocketClient | undefined,
    unsubscribe() {
      if (WebsocketClient.has(name)) {
        WebsocketClient.get(name)?.close();
        WebsocketClient.remove(name);
      }
    }
  };
};
