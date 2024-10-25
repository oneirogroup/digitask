import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";

import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { queryClient } from "@digitask/shared-lib/components/providers";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";

onlineManager.setEventListener(setOnline => NetInfo.addEventListener(state => setOnline(!!state.isConnected)));

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
};

export const useDev = () => {
  useReactQueryDevTools(queryClient);
  useAsyncStorageDevTools();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);
};
