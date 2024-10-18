import { FC, PropsWithChildren } from "react";
import { Text } from "react-native";

import { Block, Icon, cn } from "@oneiro/ui-kit";

import { BlockSectionProps } from "./block-section.types";

export const BlockSection: FC<PropsWithChildren<BlockSectionProps>> = ({ title, className, children }) => {
  return (
    <Block className={cn("flex gap-6", className)}>
      <Block className="flex flex-row items-center justify-between">
        <Text className="text-xl">{title}</Text>
        <Icon name="arrow-right" variables={{ fill: "black" }} />
      </Block>

      <Block>{children}</Block>
    </Block>
  );
};
