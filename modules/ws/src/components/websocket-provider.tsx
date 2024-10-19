import { FC, PropsWithChildren, useState } from "react";

import { WebSocketClients, WebsocketContext } from "../ctx";
import { WebsocketClient } from "../utils/websocket-client";

export const WebsocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [clients, setClients] = useState<WebSocketClients["clients"]>({});

  const addClient = (name: string, client: WebsocketClient) => {
    setClients(prev => ({ ...prev, [name]: client }));
  };

  const removeClient = (name: string) => {
    setClients(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  return <WebsocketContext.Provider value={{ clients, addClient, removeClient }}>{children}</WebsocketContext.Provider>;
};
