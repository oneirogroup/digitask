import { useContext } from "react";
import { WebSocket } from "ws";

import { WebsocketContext } from "../ctx";

export const useWebsocket = (name: string, url?: string) => {
  const wsClients = useContext(WebsocketContext);
  if (!wsClients) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }

  const { clients, addClient } = wsClients;
  if (!clients) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }

  if (!url && clients[name]) {
    return clients[name];
  }

  if (url && !clients[name]) {
    const client = new WebSocket(url);
    addClient(name, client);
    return client;
  }

  throw new Error(`Client with name ${name} already exists`);
};
