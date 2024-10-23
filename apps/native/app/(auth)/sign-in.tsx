import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { Text } from "react-native";

import { AuthHttp, Block, Form, Input, logger } from "@mdreal/ui-kit";
import AsyncStorageNative from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../../api";
import { PageLayout } from "../../components/page-layout";
import { SignInSchema, signInSchema } from "../../schemas/auth/sign-in.schema";
import { Tokens } from "../../types/tokens";
import { cache } from "../../utils/cache";

import logo from "../../assets/images/logo.png";

const authHttpSettings = AuthHttp.settings();

export default function Welcome() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (data: SignInSchema) => api.accounts.login.$post(data),
    onError: logger.error.bind(logger, "digitask.native:auth:sign-in.auth-error")
  });
  const profileMutation = useMutation({
    mutationKey: [cache.user.profile],
    mutationFn: () => api.accounts.profile.$get,
    onSuccess(data) {
      queryClient.setQueryData([cache.user.profile], data);
    }
  });

  const onSubmit: SubmitHandler<SignInSchema> = async data => {
    logger.debug("digitask.native:auth:sign-in.form-values", data);
    const response = await signInMutation.mutateAsync(data);
    logger.debug("digitask.native:auth:sign-in.auth-response", response);
    await AsyncStorageNative.setItem(Tokens.ACCESS_TOKEN, response.access_token);
    await AsyncStorageNative.setItem(Tokens.REFRESH_TOKEN, response.refresh_token);
    await authHttpSettings.retrieveTokens()();
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
      <PageLayout>
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
      </PageLayout>
    </Form>
  );
}
