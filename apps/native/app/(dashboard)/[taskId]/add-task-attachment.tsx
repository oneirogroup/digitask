import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

import { AddAdditionSchema, addAdditionSchema } from "@digitask/shared-lib";
import { Block, Form } from "@mdreal/ui-kit";

import { FileUploader } from "../../../components/file-uploader";

export default function AddSpecificTaskAttachment() {
  const { taskId } = useLocalSearchParams() as { taskId: string };

  return (
    <Block.Scroll className="border-t-neutral-90 border-t-[1px] bg-white p-4" contentClassName="flex gap-4">
      <Form<AddAdditionSchema>
        schema={addAdditionSchema}
        onSubmit={data => {
          console.log(data);
        }}
        onFormError={console.log}
      >
        <FileUploader label="Şəxsiyyət vəsiqəsinin fotosu" />

        <Text className="text-xl">Servis məlumatları</Text>

        <FileUploader label="Modemin arxa fotosu" />

        <Form.Button>
          <Text className="p-4 text-center text-white">Yadda saxla</Text>
        </Form.Button>
      </Form>
    </Block.Scroll>
  );
}
