import { useEffect, useState } from "react";

import { useWebsocket } from "./use-websocket";

export const useListen = <TData>(
  name: string,
  isListOfValues: boolean
): typeof isListOfValues extends true ? TData[] : TData | null => {
  const wsClient = useWebsocket(name);
  const [messages, setMessages] = useState<TData[]>([]);
  const [message, setMessage] = useState<TData | null>(null);

  useEffect(() => {
    if (!wsClient) return;
    const unsubscribe = wsClient.listen((data: TData) => {
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
  return isListOfValues ? Object.assign(messages, { last: messages.at(-1) }) : message;
};
