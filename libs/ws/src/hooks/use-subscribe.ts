import { useEffect, useState } from "react";

import { JSONMessage } from "../types/json-message";
import { useWebsocket } from "./use-websocket";

export const useSubscribe = <TData, TIsValueArrayList extends boolean>(
  name: string,
  event: string,
  isListOfValues: TIsValueArrayList
): TIsValueArrayList extends true ? TData[] : TData | null => {
  const wsClient = useWebsocket(name);
  const [messages, setMessages] = useState<TData[]>([]);
  const [message, setMessage] = useState<TData | null>(null);

  useEffect(() => {
    wsClient.addEventListener("message", message => {
      const jsonMessage = JSON.parse(message.data.toString());
      const data = jsonMessage.data as JSONMessage<TData>;
      if (data.event !== event) return;
      if (isListOfValues) {
        setMessages(prev => [...prev, data.data]);
        return;
      }
      setMessage(data.data);
    });
  }, []);

  // @ts-ignore
  return isListOfValues ? messages : message;
};
