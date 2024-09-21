import { FC, PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";

import { Block } from "@oneiro/ui-kit";

export const Controlled: FC<PropsWithChildren> = ({ children }) => {
  const context = useFormContext();

  if (!context) return <Block>{children}</Block>;
  console.log(context);

  return <Block></Block>;
};
