import { ComponentProps } from "react";

import { Block, Gradient } from "@oneiro/ui-kit";

export interface BlockContainerProps extends Partial<Pick<ComponentProps<typeof Block>, "className">> {
  gradient?: Gradient;
}
