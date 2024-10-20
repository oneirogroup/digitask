import { useEffect, useState } from "react";

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
    if (!wsClient) return;
    wsClient.on(event, (data: TData) => {
      if (isListOfValues) {
        setMessages(prev => [...prev, data]);
        return;
      }
      setMessage(data);
    });
  }, []);

  // @ts-ignore
  return isListOfValues ? messages : message;
};
