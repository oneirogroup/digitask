import { FC } from "react";

import { Block, Text } from "@oneiro/ui-kit";

import { HeaderLeftProps } from "./header-left.types";

export const HeaderLeft: FC<HeaderLeftProps> = ({ title = "" }) => {
  return (
    <Block className="pl-4">
      <Text className="text-1.5xl">{title}</Text>
    </Block>
  );
};
