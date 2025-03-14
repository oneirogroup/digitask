import { type DependencyList, useEffect, useState } from "react";

import { getOrCreateWSClient } from "../utils/get-or-create-ws-client";
import { WebsocketClient } from "../utils/websocket-client";
import { UseWebsocketProps } from "./use-websocket.types";

export const useWebsocket = <TData>(
  name: string,
  url?: string,
  options?: UseWebsocketProps<TData>,
  deps: DependencyList = []
): WebsocketClient | undefined => {
  const [currentWsClient, setCurrentWsClient] = useState<WebsocketClient | undefined>(undefined);

  useEffect(() => {
    const ws = getOrCreateWSClient(name, url, options);
    setCurrentWsClient(ws?.client);
    return ws?.unsubscribe;
  }, deps);

  return currentWsClient;
};
