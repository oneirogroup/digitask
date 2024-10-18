import { Link } from "expo-router";
import { ComponentProps } from "react";

import { Block } from "@oneiro/ui-kit";

export interface BlockSectionProps extends Partial<Pick<ComponentProps<typeof Block>, "className">> {
  title: string;
  href: ComponentProps<typeof Link>["href"];
}
