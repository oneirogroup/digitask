import { router } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";
import { runOnJS } from "react-native-reanimated";

import { Block, Button, Icon, Modal, ModalRef } from "@oneiro/ui-kit";
import AsyncStorageNative from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

import { palette } from "../../../../../palette";
import { BlockContainer } from "../../../components/blocks";
import { ProfileData } from "../../../types/backend/profile-data";
import { Tokens } from "../../../types/tokens";
import { cache } from "../../../utils/cache";

export default function Profile() {
  const modalRef = useRef<ModalRef>(null);
  const { data } = useQuery<ProfileData>({ queryKey: [cache.user.profile.$value] });
  if (!data) return null;

  const logout = async () => {
    await AsyncStorageNative.removeItem(Tokens.ACCESS_TOKEN);
    await AsyncStorageNative.removeItem(Tokens.REFRESH_TOKEN);
    router.replace("/welcome");
  };

  return (
    <Block.Fade>
      <Block.Scroll className="px-6 py-4" contentClassName="flex gap-6">
        <BlockContainer className="flex flex-row justify-between">
          <View className="flex gap-1">
            <Text className="text-1.5xl font-bold">Texnik adi</Text>
            <Text className="text-neutral text-lg">{data.email}</Text>
          </View>
          <View className="flex items-center justify-center">
            <Icon name="arrow-right" />
          </View>
        </BlockContainer>

        <Block className="flex gap-3">
          <BlockContainer className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-2">
              {/* <Icon name="exit" /> */}
              <Text className="text-neutral text-xl">Destek</Text>
            </View>
            <View>
              <Icon name="arrow-right" />
            </View>
          </BlockContainer>

          <BlockContainer className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-2">
              {/* <Icon name="exit" /> */}
              <Text className="text-neutral text-xl">Haqqinda</Text>
            </View>
            <View>
              <Icon name="arrow-right" />
            </View>
          </BlockContainer>

          <BlockContainer>
            <Button
              variant="none"
              onClick={() => modalRef.current?.open()}
              className="flex w-full flex-row items-center gap-2"
            >
              <Icon name="exit" variables={{ fill: palette.danger["50"] }} />
              <Text className="text-error-50 text-xl">Cixis Et</Text>
            </Button>
          </BlockContainer>
        </Block>

        <Modal
          ref={modalRef}
          type="popup"
          animationSpeed="normal"
          height={144}
          closeBtn={{ fill: palette.neutral["60"] }}
          className="flex gap-6 px-6 py-4"
        >
          <Block>
            <Text className="text-neutral-10 text-1.5xl text-center">Çıxış</Text>
            <Text className="text-center text-lg text-neutral-50">Çıxış etmək istədiyinizdən əminsiniz?</Text>
          </Block>

          <Block className="flex w-full flex-row justify-evenly gap-4">
            <Button variant="secondary" className="flex-1 py-4" onClick={() => modalRef.current?.close()}>
              <Text className="text-center">Ləğv et</Text>
            </Button>
            <Button variant="danger" className="flex-1 py-4" onClick={() => runOnJS(logout)()}>
              <Text className="text-center text-white">Çıxış et</Text>
            </Button>
          </Block>
        </Modal>
      </Block.Scroll>
    </Block.Fade>
  );
}
