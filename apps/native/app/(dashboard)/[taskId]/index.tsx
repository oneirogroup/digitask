import { useLocalSearchParams } from "expo-router";
import { FC } from "react";
import { Text } from "react-native";
import { useRecoilValue } from "recoil";

import { tasksAtom } from "@digitask/shared-lib";
import { Block, Icon, Icons } from "@mdreal/ui-kit";

import { BlockContainer } from "../../../components/blocks";

interface FieldProps {
  icon: keyof Icons;
  label: string;
  value: string;
}

const Field: FC<FieldProps> = ({ icon, label, value }) => {
  return (
    <Block>
      <Icon name={icon} />
      <Text>{label}</Text>
      <Text>{value}</Text>
    </Block>
  );
};

export default function SpecificTask() {
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const tasks = useRecoilValue(tasksAtom);
  const currentTask = tasks.find(task => (task.id = +taskId));

  return (
    <Block.Scroll className="p-4">
      <BlockContainer>
        <Field icon="user-doctor" label="Ad və soyad" value="" />
      </BlockContainer>
    </Block.Scroll>
  );
}
