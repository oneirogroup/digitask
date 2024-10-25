import { FC, PropsWithChildren } from "react";

import { Block, cn } from "@mdreal/ui-kit";

import { PageLayoutProps } from "./page-layout.types";

export const PageLayout: FC<PropsWithChildren<PageLayoutProps>> = ({ children, className }) => {
  // ToDo: Work on View.Scroll contentClassName attribute
  //           <View.Scroll className="grid items-center justify-between" contentClassName={cn("grid items-center justify-between", className)}>{children}</View.Scroll>
  return (
    <Block className={cn("grid items-center justify-between", "h-screen px-4 py-28", className)}>{children}</Block>
  );
};
