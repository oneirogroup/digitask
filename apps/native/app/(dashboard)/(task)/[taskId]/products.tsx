import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";

import { type AddResourceSchema, addResourceSchema } from "@digitask/shared-lib";
import { Block, Form, Input, Select, useFormRef } from "@mdreal/ui-kit";

import { Warehouse } from "../../../../components/warehouse";
import { WarehouseItem } from "../../../../components/warehouse/warehouse-item";

type AttachmentType = "tv" | "internet" | "voice";

export default function AddSpecificTaskProduct() {
  const { taskId } = useLocalSearchParams() as { taskId: string };
  const [products, setProducts] = useState<AddResourceSchema[]>([]);
  const form = useFormRef<AddResourceSchema>();

  return (
    <KeyboardAvoidingView className="h-full">
      <View>
        <Text>{JSON.stringify(products)}</Text>
      </View>

      <Block.Scroll className="border-t-neutral-90 border-t-[1px] bg-white p-4" contentClassName="flex gap-4">
        <Form<AddResourceSchema>
          ref={form}
          schema={addResourceSchema}
          defaultValues={{ task: +taskId }}
          onSubmit={async data => {
            products.push(data);
            form.reset();

            // const reqData = { task: data.task, item: data.item.id, count: data.count };
            // console.log("data", data, reqData);
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
