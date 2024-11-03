import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { api } from "libs/shared-lib/src/api";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { Text } from "react-native";

import {
  SignInSchema,
  StorageKeys,
  fields,
  profileAtom,
  signInAtom,
  signInSchema,
  useRecoilMutation
} from "@digitask/shared-lib";
import { Block, Form, Input, logger } from "@mdreal/ui-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";

import logo from "../../assets/images/logo.png";

export default function Welcome() {
  const navigation = useNavigation();

  const signInMutation = useRecoilMutation(signInAtom, {
    mutationFn: (data: SignInSchema) => api.accounts.login.$post(data),
    async onSuccess(data) {
      await AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN, data.access_token);
      await AsyncStorage.setItem(StorageKeys.REFRESH_TOKEN, data.refresh_token);
      await AsyncStorage.setItem(StorageKeys.USER_EMAIL, data.email);
      await AsyncStorage.setItem(StorageKeys.PHONE_NUMBER, data.phone);
    },
    onError: logger.error.bind(logger, "digitask.native:auth:sign-in.auth-error"),
    isNullable: true
  });

  const profileMutation = useRecoilMutation(profileAtom, {
    mutationKey: [fields.user.profile.toString()],
    mutationFn: () => api.accounts.profile.$get,
    onError: logger.error.bind(logger, "digitask.native:auth:sign-in.profile-error"),
    isNullable: true
  });

  const onSubmit: SubmitHandler<SignInSchema> = async data => {
    logger.debug("digitask.native:auth:sign-in.form-values", data);
    const response = await signInMutation.mutateAsync(data);
    logger.debug("digitask.native:auth:sign-in.auth-response", response);
    // @ts-ignore
    await profileMutation.mutateAsync();
    navigation.dispatch(StackActions.popToTop());
    // @ts-ignore
    navigation.replace("(dashboard)");
  };

  const onFormError: SubmitErrorHandler<SignInSchema> = errors => {
    logger.log("errors", errors);
  };

  return (
    <Form<SignInSchema> schema={signInSchema} onSubmit={onSubmit} onFormError={onFormError}>
      <Block className="flex h-full items-center justify-between px-4 py-28">
        <Block className="flex items-center gap-6">
          <Block className="bg-primary w-68 rounded-2xl p-6">
            <Image source={logo} style={{ width: 150, height: 140 }} />
          </Block>

          <Block className="flex gap-6">
            <Input.Controlled
              name="email"
              type="text"
              label="Email"
              variant="secondary"
              icon={{ left: "email" }}
              disabled={signInMutation.isPending}
            />
            <Input.Controlled
              name="password"
              type="password"
              label="Password"
              variant="secondary"
              icon={{ left: "key" }}
              disabled={signInMutation.isPending}
            />
          </Block>
        </Block>

        <Block className="flex gap-6">
          <Form.Button variant="primary" className="w-full p-4" isLoading={signInMutation.isPending}>
            <Text className="text-center text-white">Daxil ol</Text>
          </Form.Button>

          <Block>
            <Link href="./forgot-password">
              <Text className="text-link text-center underline">Şifrəni unutmusunuz?</Text>
            </Link>
          </Block>
        </Block>
      </Block>
    </Form>
  );
}
