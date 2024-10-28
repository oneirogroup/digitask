import { FC, PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

import { TailwindConfigProvider, logger } from "@mdreal/ui-kit";
import { WebsocketProvider } from "@mdreal/ws-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { isDev } from "../../const";
import { RecoilUtils } from "../recoil-utils";

logger.setLogLevel(isDev ? "debug" : "log");

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: logger.debug.bind(logger, "digitask.native:providers:query-client.mutation-error")
    }
  }
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
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
