import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";

import { AuthHttp, Block, Form, Input, Text, logger } from "@oneiro/ui-kit";
import AsyncStorageNative from "@react-native-async-storage/async-storage";

import { PageLayout } from "../../components/page-layout";
import { SignInSchema, signInSchema } from "../../schemas/auth/sign-in.schema";
import { AuthToken } from "../../types/backend/auth-token";
import { Tokens } from "../../types/tokens";

import logo from "../../assets/images/logo.png";

export default function Welcome() {
  const onSubmit: SubmitHandler<SignInSchema> = data => {
    logger.log("digitask.native:auth:sign-in.form-values", data);

    AuthHttp.instance()
      .post<AuthToken>("/accounts/login/", { ...data, remember_me: false })
      .then(async response => {
        logger.debug("digitask.native:auth:sign-in.auth-response", response);
        await AsyncStorageNative.setItem(Tokens.ACCESS_TOKEN, response.access_token);
        await AsyncStorageNative.setItem(Tokens.REFRESH_TOKEN, response.refresh_token);
        router.replace("/(dashboard)");
      })
      .catch(logger.error.bind(logger, "digitask.native:auth:sign-in.auth-error"));
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
            <Input.Controlled name="email" type="text" label="Email" variant="secondary" icon={{ left: "email" }} />
            <Input.Controlled
              name="password"
              type="password"
              label="Password"
              variant="secondary"
              icon={{ left: "key" }}
            />
          </Block>
        </Block>

        <Block className="flex gap-6">
          <Form.Button variant="primary" className="w-full p-4">
            <Text className="text-center text-white">Daxil ol</Text>
          </Form.Button>

          <Block>
            <Link href="/forgot-password">
              <Text className="text-link text-center underline">Şifrəni unutmusunuz?</Text>
            </Link>
          </Block>
        </Block>
      </PageLayout>
    </Form>
  );
}
