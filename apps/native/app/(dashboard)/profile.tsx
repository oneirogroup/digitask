import { BlockContainer } from "apps/native/components/blocks";
import { router } from "expo-router";
import { palette } from "palette";
import { Modal } from "react-native";
import { useBoolean } from "react-use";

import { Block, Button, Icon, Text, View } from "@oneiro/ui-kit";
import AsyncStorageNative from "@react-native-async-storage/async-storage";

import { Tokens } from "../../types/tokens";

export default function Profile() {
  const [isModalVisible, toggleVisibility] = useBoolean(false);

  // const logout = async () => {
  //   await AsyncStorageNative.removeItem(Tokens.ACCESS_TOKEN);
  //   await AsyncStorageNative.removeItem(Tokens.REFRESH_TOKEN);
  //   router.replace("/welcome");
  // };

  return (
    <Block className="flex gap-6 px-6 py-4">
      <BlockContainer className="flex flex-row justify-between">
        <View className="flex gap-1">
          <Text className="text-1.5xl font-bold">Texnik adi</Text>
          <Text className="text-neutral text-lg">texnik:sfsdf</Text>
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
          <Button variant="none" onClick={toggleVisibility} className="flex w-full flex-row items-center gap-2">
            <Icon name="exit" variables={{ fill: palette.error["50"] }} />
            <Text className="text-error-50 text-xl">Cixis Et</Text>
          </Button>
        </BlockContainer>
      </Block>

      <Modal visible={isModalVisible} onRequestClose={toggleVisibility}>
        <Text>123</Text>
      </Modal>
    </Block>
  );
}
