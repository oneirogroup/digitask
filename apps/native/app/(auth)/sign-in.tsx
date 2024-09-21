import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useForm } from "react-hook-form";

import { Block, Button, Input, Text, View } from "@oneiro/ui-kit";

import { Controlled } from "../../components/controlled";

import logo from "../../assets/images/logo.png";

export default function Welcome() {
  const form = useForm();

  return (
    <View className="grid h-screen grid-rows-1 items-center justify-between px-4 py-40">
      <Block className="flex items-center gap-6">
        <Block className="bg-primary w-68 rounded-2xl p-6">
          <Image source={logo} style={{ width: 150, height: 140 }} />
        </Block>

        <Block>
          {/*<Controlled>*/}
          {/*<Input />*/}
          {/*</Controlled>*/}
        </Block>
      </Block>

      <Block className="flex w-full gap-6">
        <Button variant="primary" className="w-full p-4" onClick={() => router.push("/sign-in")}>
          <Text className="text-center text-white">Daxil ol</Text>
        </Button>
        <Block>
          <Link href="/forgot-password">
            <Text className="text-center underline">Şifrəni unutmusunuz?</Text>
          </Link>
        </Block>
      </Block>
    </View>
  );
}
