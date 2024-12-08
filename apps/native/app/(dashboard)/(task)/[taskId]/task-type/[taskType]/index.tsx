import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import { Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";

import { Backend, DateService, TaskStatuses, api, fields, tasksAtom } from "@digitask/shared-lib";
import { Block, Button, Icon, Modal, ModalRef, When } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { palette } from "../../../../../../../../palette";
import { BlockContainer } from "../../../../../../components/blocks";
import { Field } from "../../../../../../components/field";

const translation = {
  tv: "TV",
  internet: "İnternet",
  voice: "Səs"
};

const statuses: Record<TaskStatuses, string> = {
  [TaskStatuses.Completed]: "Bitmiş",
  [TaskStatuses.InProgress]: "Davam edir",
  [TaskStatuses.Waiting]: "Gözləmədə",
  [TaskStatuses.Started]: "Başlanmış",
  [TaskStatuses.All]: "Hamısı"
};

export default function SpecificTask() {
  const router = useRouter();
  const typeModalRef = useRef<ModalRef>(null);

  const { taskId, taskType } = useLocalSearchParams() as { taskId: string; taskType: "connection" | "problem" };
  const tasks = useRecoilValue(tasksAtom(taskType));

  const { data: currentTask = tasks.find(task => task.id === +taskId) } = useQuery({
    queryKey: [fields.tasks.get, taskId],
    queryFn: () => api.services.task.$get(+taskId),
    enabled: !!taskId
  });

  useFocusEffect(() => {
    return () => {
      typeModalRef.current?.close();
    };
  });

  if (!currentTask) {
    return (
      <Block>
        <Text className="text-center text-lg">Tapşırıq tapılmadı</Text>
      </Block>
    );
  }

  const startDate = DateService.from(`${currentTask.date} ${currentTask.start_time}`);
  const endDate = DateService.from(`${currentTask.date} ${currentTask.end_time}`);

  const services = [
    currentTask.tv ? { ...currentTask.tv, type: "tv" } : null,
    currentTask.voice ? { ...currentTask.voice, type: "voice" } : null,
    currentTask.internet ? { ...currentTask.internet, type: "internet" } : null
  ].filter(Boolean) as (Backend.Tv | Backend.Internet | Backend.Voice)[];

  const redirectTo = (type: "tv" | "voice" | "internet") => {
    return () => {
      router.push({ pathname: "/[taskId]/task-type/[taskType]/type/[type]", params: { taskId, taskType, type } });
    };
  };

  return (
    <Block.Scroll contentClassName="flex gap-4 p-4">
      <BlockContainer className="flex gap-10">
        <Block className="flex gap-6">
          <Field
            icon={<Icon name="user" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Ad və soyad"
            value={currentTask.full_name}
          />
          <Field
            icon={<Icon name="phone" variables={{ stroke: palette.primary["50"] }} />}
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
            label="Ünvan"
            value={currentTask.location}
          />
          <Field
            icon={<Icon name="region" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Region"
            value={currentTask.group[0]?.region || "Naməlum region"}
          />
        </Block>

        <Block className="flex gap-6">
          <Field
            icon={<Icon name="gear-wheel" state={false} variables={{ stroke: palette.primary["50"] }} />}
            label="Xidmət"
            value={
              <View className="flex flex-row gap-2">
                <When condition={currentTask.is_tv}>
                  <Icon name="tv" variables={{ fill: palette.primary["50"] }} />
                </When>
                <When condition={currentTask.is_internet}>
                  <Icon name="web" variables={{ fill: palette.primary["50"] }} />
                </When>
                <When condition={currentTask.is_voice}>
                  <Icon name="voice" variables={{ stroke: palette.primary["50"] }} />
                </When>
              </View>
            }
          />
          <Field
            icon={<Icon name="clock" state={false} variables={{ fill: palette.primary["50"] }} />}
            label="Tarix"
            value={`${startDate.format("DD MMMM, HH:mm")}-${endDate.format("HH:mm")}`}
          />
          <Field
            icon={<Icon name="chat" state="square" variables={{ stroke: palette.primary["50"] }} />}
            label="Status"
            value={statuses[currentTask.status]}
          />
          <Field
            icon={<Icon name="user" state="technic" variables={{ stroke: palette.primary["50"] }} />}
            label="Texniki qrup"
            value={currentTask.group[0]?.group || "Naməlum qrup"}
          />
        </Block>

        <Block>
          <Text>Qeyd</Text>
          <Text className="font-semibold">{currentTask.note}</Text>
          <View className="border-b-primary mt-2 w-full border-b-[1px] bg-transparent" />
        </Block>
      </BlockContainer>

      {services.map(service => (
        <BlockContainer key={service.id} className="flex gap-6">
          {/* @ts-ignore */}
          <Text className="text-neutral-20 text-xl">{translation[service.type]} anketi</Text>

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

      <When condition={!currentTask.has_tv || !currentTask.has_internet || !currentTask.has_voice}>
        <BlockContainer>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => typeModalRef.current?.open()}
            className="flex flex-row items-center justify-between p-2"
          >
            <Text>Yeni Anket</Text>
            <View>
              <Icon name="plus" variables={{ stroke: palette.primary["50"] }} />
            </View>
          </TouchableOpacity>
        </BlockContainer>
      </When>

      <When condition={currentTask.has_tv || currentTask.has_internet || currentTask.has_voice}>
        <BlockContainer>
          <Pressable
            onPress={() =>
              router.push({ pathname: "/[taskId]/task-type/[taskType]/products", params: { taskId, taskType } })
            }
            className="flex flex-row items-center justify-between p-2"
          >
            <Text>Məhsul əlavə et</Text>
            <View>
              <Icon name="plus" variables={{ stroke: palette.primary["50"] }} />
            </View>
          </Pressable>
        </BlockContainer>
      </When>

      <Modal ref={typeModalRef} type="popup" className="p-4">
        <View className="flex gap-6">
          <View>
            <Text className="text-1.5xl text-center">Xidmətin növü</Text>
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
