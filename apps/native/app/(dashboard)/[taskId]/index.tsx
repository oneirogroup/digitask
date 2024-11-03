import { router, useLocalSearchParams } from "expo-router";
import { ComponentProps, FC, ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { DateService, tasksAtom } from "@digitask/shared-lib";
import { Block, Icon } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { BlockContainer } from "../../../components/blocks";

interface FieldProps {
  icon: ReactElement<ComponentProps<typeof Icon>, typeof Icon>;
  label: string;
  value: string;
}

const Field: FC<FieldProps> = ({ icon, label, value }) => {
  return (
    <Block>
      <Block className="flex flex-row items-center gap-2 px-1">
        <View>{icon}</View>
        <Text className="flex-1">{label}</Text>
        <Text className="text-right">{value}</Text>
      </Block>
      <View className="border-b-primary mt-2 w-full border-b-[1px] bg-transparent" />
    </Block>
  );
};

export default function SpecificTask() {
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const tasks = useRecoilValue(tasksAtom);
  const currentTask = tasks.find(task => task.id === +taskId);

  if (!currentTask) {
    return <Block>Task not found</Block>;
  }

  const startDate = DateService.from(`${currentTask.date} ${currentTask.start_time}`);
  const endDate = DateService.from(`${currentTask.date} ${currentTask.end_time}`);

  console.log(currentTask);

  return (
    <Block.Scroll className="p-4" contentClassName="flex gap-4">
      <BlockContainer className="flex gap-10">
        <Block className="flex gap-6">
          <Field
            icon={<Icon name="user" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Ad və soyad"
            value={currentTask.full_name}
          />
          <Field
            icon={<Icon name="phone" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Qeydiyyat nömrəsi"
            value={currentTask.phone}
          />
          <Field
            icon={<Icon name="phone" state="call" variables={{ fill: palette.primary["50"] }} />}
            label="Əlaqə nömrəsi"
            value={currentTask.phone}
          />
          <Field
            icon={<Icon name="location" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Adres"
            value={currentTask.location}
          />
          <Field
            icon={<Icon name="region" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Adres"
            value={currentTask.group[0]?.region || "Naməlum region"}
          />
        </Block>

        {[currentTask.tv, currentTask.voice, currentTask.internet].filter(Boolean).map(service => (
          <Block key={service.id} className="flex gap-6">
            <Field
              icon={<Icon name="gear-wheel" state={false} variables={{ stroke: palette.primary["50"] }} />}
              label="Adres"
              value={currentTask.services}
            />
            <Field
              icon={<Icon name="clock" state={false} variables={{ fill: palette.primary["50"] }} />}
              label="Zaman"
              value={`${startDate.format("DD MMMM, HH:mm")}-${endDate.format("HH:mm")}`}
            />
            <Field
              icon={<Icon name="chat" state="square" variables={{ stroke: palette.primary["50"] }} />}
              label="Status"
              value={currentTask.status}
            />
            <Field
              icon={<Icon name="user" state="technic" variables={{ stroke: palette.primary["50"] }} />}
              label="Texniki qrup"
              value={currentTask.group[0]?.group || "Naməlum qrup"}
            />
          </Block>
        ))}

        <Block>
          <Text>Qeyd</Text>
          <Text className="font-semibold">{currentTask.note}</Text>
          <View className="border-b-primary mt-2 w-full border-b-[1px] bg-transparent" />
        </Block>
      </BlockContainer>

      <BlockContainer>
        <Pressable
          onPress={() => router.push({ pathname: "/(dashboard)/[taskId]/add-task-addition", params: { taskId } })}
          className="flex flex-row items-center justify-between p-2"
        >
          <Text>Yeni Qosulma</Text>
          <View>
            <Icon name="plus" />
          </View>
        </Pressable>
      </BlockContainer>
    </Block.Scroll>
  );
}
