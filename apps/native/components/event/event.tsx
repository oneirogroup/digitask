import { FC } from "react";

import { Block, Text } from "@oneiro/ui-kit";

import { BlockContainer } from "../blocks";
import { EventProps } from "./event.types";

export const Event: FC<EventProps> = () => {
  return (
    <BlockContainer className="rounded-2xl p-4" gradient={{ from: "primary-50", to: "primary-50/60", sideTo: "lt" }}>
      <Block className="grid grid-cols-2">
        <Block>
          <Text>Event 1</Text>
        </Block>
        <Block>
          <Text>Event 2</Text>
        </Block>
      </Block>
    </BlockContainer>
  );
};
