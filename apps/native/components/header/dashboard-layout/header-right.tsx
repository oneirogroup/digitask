import { Link } from "expo-router";
import { FC } from "react";

import { Block, Icon } from "@oneiro/ui-kit";

export const HeaderRight: FC = () => {
  return (
    <Block className="flex flex-row items-center justify-end gap-4 pr-4">
      <Link href="/chat">
        <Icon name="chat" variables={{ stroke: "#005ABF" }} />
      </Link>
      <Icon name="notifications" variables={{ stroke: "#005ABF", checkmark: "none" }} />
    </Block>
  );
};
