import { FC, PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { RecoilRoot } from "recoil";

import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { TailwindConfigProvider, logger } from "@mdreal/ui-kit";
import { WebsocketProvider } from "@mdreal/ws-client";
import NetInfo from "@react-native-community/netinfo";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";

import { isDev } from "../../const";
import { RecoilUtils } from "../recoil-utils";

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
        <RecoilRoot>
          <RecoilUtils />
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </RecoilRoot>
      </TailwindConfigProvider>
    </WebsocketProvider>
  );
};
