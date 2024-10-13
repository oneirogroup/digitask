import { FC, PropsWithChildren, useState } from "react";
import { WebSocket } from "ws";

import { WebSocketClients, WebsocketContext } from "../ctx";

export const WebsocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [clients, setClients] = useState<WebSocketClients["clients"]>({});

  const addClient = (name: string, client: WebSocket) => {
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
