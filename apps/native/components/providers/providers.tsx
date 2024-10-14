import { FC, PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";

import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { TailwindConfigProvider, logger } from "@oneiro/ui-kit";
import { WebsocketProvider } from "@oneiro/ws-client";
import NetInfo from "@react-native-community/netinfo";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";

import { isDev } from "../../const";

onlineManager.setEventListener(setOnline => NetInfo.addEventListener(state => setOnline(!!state.isConnected)));

logger.setLogLevel(isDev ? "debug" : "log");

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: logger.debug.bind(logger, "digitask.native:providers:query-client.mutation-error")
    }
  }
});
const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  useReactQueryDevTools(queryClient);
  useAsyncStorageDevTools();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <WebsocketProvider>
      <TailwindConfigProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </TailwindConfigProvider>
    </WebsocketProvider>
  );
};
