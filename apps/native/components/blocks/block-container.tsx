import { FC, PropsWithChildren } from "react";

import { Block, LinearGradient, cn } from "@oneiro/ui-kit";

import { BlockContainerProps } from "./block-container.types";

export const BlockContainer: FC<PropsWithChildren<BlockContainerProps>> = ({ className, gradient, children }) => {
  return gradient ? (
    <LinearGradient className={className} {...gradient}>
      {children}
    </LinearGradient>
  ) : (
    <Block className={cn("rounded-2xl bg-white p-4", className)}>{children}</Block>
  );
};
