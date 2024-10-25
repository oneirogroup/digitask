import { Image } from "expo-image";
import { Link, useNavigation } from "expo-router";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { Text } from "react-native";

import { api } from "@digitask/shared-lib/api";
import { signInAtom } from "@digitask/shared-lib/atoms/backend/accounts/login";
import { profileAtom } from "@digitask/shared-lib/atoms/backend/accounts/profile";
import { useRecoilMutation } from "@digitask/shared-lib/hooks/use-recoil-mutation";
import { SignInSchema, signInSchema } from "@digitask/shared-lib/schemas/auth/sign-in.schema";
import { fields } from "@digitask/shared-lib/utils/fields";
import { AuthHttp, Block, Form, Input, logger } from "@mdreal/ui-kit";
import { StackActions } from "@react-navigation/native";

import logo from "../../assets/images/logo.png";

const authHttpSettings = AuthHttp.settings();

export default function Welcome() {
  const navigation = useNavigation();

  const signInMutation = useRecoilMutation(signInAtom, {
    mutationFn: (data: SignInSchema) => api.accounts.login.$post(data),
    onError: logger.error.bind(logger, "digitask.native:auth:sign-in.auth-error")
  });
  const profileMutation = useRecoilMutation(profileAtom, {
    mutationKey: [fields.user.profile],
    mutationFn: () => api.accounts.profile.$get,
    onError: logger.error.bind(logger, "digitask.native:auth:sign-in.profile-error")
  });

  const onSubmit: SubmitHandler<SignInSchema> = async data => {
    logger.debug("digitask.native:auth:sign-in.form-values", data);
    const response = await signInMutation.mutateAsync(data);
    logger.debug("digitask.native:auth:sign-in.auth-response", response);
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
      <Block.Scroll className="h-screen px-4 py-28" contentClassName="grid items-center justify-between">
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
      </Block.Scroll>
    </Form>
  );
}
