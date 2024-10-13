import { createContext } from "react";
import { WebSocket } from "ws";

export interface WebSocketClients {
  clients: Record<string, WebSocket>;
  addClient(name: string, client: WebSocket): void;
  removeClient(name: string): void;
}

export const WebsocketContext = createContext<WebSocketClients>(null!);
