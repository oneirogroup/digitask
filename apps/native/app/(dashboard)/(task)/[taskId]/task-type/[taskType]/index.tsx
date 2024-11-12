import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useRecoilValue } from "recoil";

import { Backend, DateService, tasksAtom } from "@digitask/shared-lib";
import { Block, Button, Icon, Modal, ModalRef, When } from "@mdreal/ui-kit";

import { palette } from "../../../../../../../../palette";
import { BlockContainer } from "../../../../../../components/blocks";
import { Field } from "../../../../../../components/task/add-attachment/field";

const translation = {
  tv: "TV",
  internet: "İnternet",
  voice: "Səs"
};

export default function SpecificTask() {
  const attachmentSelectModalRef = useRef<ModalRef>(null);

  const { taskId, taskType } = useLocalSearchParams() as { taskId: string; taskType: "connection" | "problem" };
  const tasks = useRecoilValue(tasksAtom(taskType));
  const currentTask = tasks.find(task => task.id === +taskId);

  useFocusEffect(() => {
    return () => {
      attachmentSelectModalRef.current?.close();
    };
  });

  if (!currentTask) {
    return (
      <Block>
        <Text>Task not found</Text>
      </Block>
    );
  }

  const startDate = DateService.from(`${currentTask.date} ${currentTask.start_time}`);
  const endDate = DateService.from(`${currentTask.date} ${currentTask.end_time}`);

  const services = [
    currentTask.has_tv ? { ...currentTask.tv, type: "tv" } : null,
    currentTask.has_voice ? { ...currentTask.voice, type: "voice" } : null,
    currentTask.has_internet ? { ...currentTask.internet, type: "internet" } : null
  ].filter(Boolean) as (Backend.Tv | Backend.Internet | Backend.Voice)[];

  const redirectTo = (type: "tv" | "voice" | "internet") => {
    return () => {
      router.push({
        pathname: "/[taskId]/task-type/[taskType]/type/[type]",
        params: { taskId, taskType, type }
      });
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

        {services.map(service => (
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

      {services.map(service => (
        <BlockContainer>
          {/* @ts-ignore */}
          <Text>{translation[service.type]} anketi</Text>

          <When condition={!!service.modem_SN}>
            <Field label="Modem S/N" value={service.modem_SN || "Qeyd yoxdur"} />
          </When>

          <When condition={"siqnal" in service}>
            {/* @ts-ignore */}
            <Field label="Siqnal" value={service.siqnal || "Qeyd yoxdur"} />
          </When>

          <When condition={"internet_packs" in service}>
            {/* @ts-ignore */}
            <Field label="Internet paketi" value={service.internet_packs || "Qeyd yoxdur"} />
          </When>

          <When condition={"home_number" in service}>
            {/* @ts-ignore */}
            <Field label="Ev nomresi" value={service.home_number || "Qeyd yoxdur"} />
          </When>

          <When condition={"password" in service}>
            {/* @ts-ignore */}
            <Field label="Parol" value={service.password || "Qeyd yoxdur"} />
          </When>

          <When condition={!!service.photo_modem}>
            <View className="m-auto p-4">
              <Image source={service.photo_modem} style={{ width: 200, height: 200 }} />
            </View>
          </When>
        </BlockContainer>
      ))}

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
