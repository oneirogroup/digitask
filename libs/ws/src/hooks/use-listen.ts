import { useEffect, useState } from "react";

import { useWebsocket } from "./use-websocket";

export const useListen = <TData, TIsValueArrayList extends boolean>(
  name: string,
  isListOfValues: TIsValueArrayList
): TIsValueArrayList extends true ? TData[] : TData | null => {
  const wsClient = useWebsocket(name);
  const [messages, setMessages] = useState<TData[]>([]);
  const [message, setMessage] = useState<TData | null>(null);

  useEffect(() => {
    wsClient.addEventListener("message", event => {
      if (isListOfValues) {
        setMessages(prev => [...prev, JSON.parse(event.data.toString())]);
        return;
      }
      setMessage(JSON.parse(event.data.toString()));
    });
  }, []);

  // @ts-ignore
  return isListOfValues ? messages : message;
};
