import { FC, PropsWithChildren } from "react";

import { Block, cn } from "@oneiro/ui-kit";

import { PageLayoutProps } from "./page-layout.types";

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, className }) => {
  return (
    <Block className={cn("grid items-center justify-between", "h-screen px-4 py-28", className)}>{children}</Block>
  );
};
