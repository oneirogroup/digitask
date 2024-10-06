import { FC, PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { ClickOutsideProvider } from "react-native-click-outside";

import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { AuthHttp, TailwindConfigProvider, logger } from "@oneiro/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";

import { isDev } from "../../const";
import { Tokens } from "../../types/tokens";

onlineManager.setEventListener(setOnline => NetInfo.addEventListener(state => setOnline(!!state.isConnected)));

logger.setLogLevel(isDev ? "debug" : "log");
AuthHttp.waitForToken({ timeout: 1e5 })
  .then(() => AsyncStorage.getItem(Tokens.ACCESS_TOKEN))
  .then(AuthHttp.setToken)
  .catch(console.log)
  .catch(AuthHttp.stopWaiting);

const queryClient = new QueryClient({});
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
    <TailwindConfigProvider>
      <ClickOutsideProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ClickOutsideProvider>
    </TailwindConfigProvider>
  );
};
