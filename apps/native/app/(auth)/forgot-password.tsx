import { Block, Input, Text } from "@oneiro/ui-kit";

import { PageLayout } from "../../components/page-layout";

export default function ForgotPassword() {
  return (
    <PageLayout className="justify-center">
      <Block>
        <Text className="text-center">Mail adresinizi daxil edin.</Text>

        <Input label="Mail adresiniz" icon={{ left: "email" }} />
      </Block>
    </PageLayout>
  );
}
