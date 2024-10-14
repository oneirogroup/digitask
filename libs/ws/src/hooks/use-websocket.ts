import { useContext, useEffect } from "react";

import { WebsocketContext } from "../ctx";
import { WebsocketClient } from "../utils/websocket-client";

export const useWebsocket = (name: string, url?: string): WebsocketClient | undefined => {
  const wsClients = useContext(WebsocketContext);

  useEffect(() => {
    if (!wsClients) {
      throw new Error("useWebsocket must be used within a WebsocketProvider");
    }

    const { clients, addClient } = wsClients;
    if (!clients) {
      throw new Error("useWebsocket must be used within a WebsocketProvider");
    }

    if (!url && clients[name]) {
      return;
    }

    if (url && !clients[name]) {
      const client = new WebsocketClient(url);
      addClient(name, client);
      return;
    }
  }, []);

  return wsClients.clients[name];
};
