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
    if (!wsClient) return;
    const unsubscribe = wsClient.listen((data: TData) => {
      console.log(data);
      if (isListOfValues) {
        setMessages(prev => [...prev, data]);
        return;
      }
      setMessage(data);
    });

    return () => {
      unsubscribe();
    };
  }, [wsClient]);

  // @ts-ignore
  return isListOfValues ? messages : message;
};
