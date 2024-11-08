import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { DateService, tasksAtom } from "@digitask/shared-lib";
import { Block, Button, Icon, Modal, ModalRef, When } from "@mdreal/ui-kit";

import { palette } from "../../../../../../palette";
import { BlockContainer } from "../../../../components/blocks";
import { Field } from "../../../../components/task/add-attachment/field";

export default function SpecificTask() {
  const attachmentSelectModalRef = useRef<ModalRef>(null);

  const { taskId } = useLocalSearchParams() as { taskId: string };
  const tasks = useRecoilValue(tasksAtom);
  const currentTask = tasks.find(task => task.id === +taskId);

  if (!currentTask) {
    return <Block>Task not found</Block>;
  }

  const startDate = DateService.from(`${currentTask.date} ${currentTask.start_time}`);
  const endDate = DateService.from(`${currentTask.date} ${currentTask.end_time}`);

  const redirectTo = (type: "tv" | "voice" | "internet") => {
    return () => {
      router.push({ pathname: "/(dashboard)/(task)/[taskId]/type/[type]", params: { taskId, type } });
    };
  };

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
          onPress={() => attachmentSelectModalRef.current?.open()}
          className="flex flex-row items-center justify-between p-2"
        >
          <Text>Yeni Qosulma</Text>
          <View>
            <Icon name="plus" />
          </View>
        </Pressable>
      </BlockContainer>

      <Modal ref={attachmentSelectModalRef} type="popup" height={123} className="p-4">
        <View className="flex gap-6">
          <View>
            <Text className="text-1.5xl text-center">Servis növü</Text>
            <Text className="text-neutral text-center text-lg">Hansı anketi doldurursunuz?</Text>
          </View>

          <View className="flex flex-row gap-4">
            <When condition={!currentTask.has_tv}>
              <Button variant="secondary" className="border-secondary flex-1" onClick={redirectTo("tv")}>
                <Text className="text-center">Tv</Text>
              </Button>
            </When>

            <When condition={!currentTask.has_internet}>
              <Button variant="secondary" className="border-secondary flex-1" onClick={redirectTo("internet")}>
                <Text className="text-center">İnternet</Text>
              </Button>
            </When>

            <When condition={!currentTask.has_voice}>
              <Button variant="secondary" className="border-secondary flex-1" onClick={redirectTo("voice")}>
                <Text className="text-center">Səs</Text>
              </Button>
            </When>
          </View>
        </View>
      </Modal>
    </Block.Scroll>
  );
}
