import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Text } from "react-native";

import { type AddResourceSchema, addResourceSchema, productsAtom, useRecoilArray } from "@digitask/shared-lib";
import { Block, Form, Input, Select } from "@mdreal/ui-kit";

import { Warehouse } from "../../../../components/warehouse";
import { WarehouseItem } from "../../../../components/warehouse/warehouse-item";

type AttachmentType = "tv" | "internet" | "voice";

export default function AddSpecificTaskProduct() {
  const { taskId, editId } = useLocalSearchParams() as { taskId: string; editId: string };
  const router = useRouter();
  const [products, controls] = useRecoilArray(productsAtom);

  return (
    <KeyboardAvoidingView className="h-full">
      <Block.Scroll className="border-t-neutral-90 border-t-[1px] bg-white p-4" contentClassName="flex gap-4">
        <Form<AddResourceSchema>
          schema={addResourceSchema}
          defaultValues={{
            id: editId ? +editId : products.length,
            task: +taskId,
            ...(editId ? controls.get(+editId) : {})
          }}
          onSubmit={async product => {
            controls.add(product);
            router.back();
          }}
          onFormError={console.log.bind(console, "error")}
        >
          <Warehouse />
          <WarehouseItem />

          <Select.Controlled<AttachmentType, AddResourceSchema> name="type" label="Servis növünü seçin...">
            <Select.Option label="TV" value="tv" />
            <Select.Option label="İnternet" value="internet" />
            <Select.Option label="Səs" value="voice" />
          </Select.Controlled>

          <Input.Controlled
            name="count"
            label="Say"
            className="border-primary rounded-2xl"
            type="number"
            disabled={false}
          />

          <Form.Button>
            <Text className="p-3 text-center text-white">Əlavə et</Text>
          </Form.Button>
        </Form>
      </Block.Scroll>
    </KeyboardAvoidingView>
  );
}
