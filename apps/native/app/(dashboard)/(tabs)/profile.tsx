import { Link, router } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";
import { runOnJS } from "react-native-reanimated";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { profileAtom, tokenSelector } from "@digitask/shared-lib";
import { Block, Button, Icon, Modal, ModalRef } from "@mdreal/ui-kit";

import { palette } from "../../../../../palette";
import { BlockContainer } from "../../../components/blocks";

export default function Profile() {
  const modalRef = useRef<ModalRef>(null);
  const userProfile = useRecoilValue(profileAtom);
  const setToken = useSetRecoilState(tokenSelector);
  if (!userProfile) return null;

  const logout = async () => {
    setToken(null);
    router.replace("/welcome");
  };

  return (
    <Block.Fade className="bg-neutral-95">
      <Block.Scroll className="px-6 py-4" contentClassName="flex gap-6">
        <Link href="/(dashboard)/(profile)/profile-data">
          <BlockContainer className="flex flex-row justify-between">
            <View className="flex gap-1">
              <Text className="text-1.5xl font-bold">Texnik adi</Text>
              <Text className="text-neutral text-lg">{userProfile.email}</Text>
            </View>
            <View className="flex items-center justify-center">
              <Icon name="arrow-right" />
            </View>
          </BlockContainer>
        </Link>

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
