import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Text } from "react-native";
import { useRecoilValue } from "recoil";

import {
  AddAdditionSchema,
  InternetAttachmentSchema,
  TVAttachmentSchema,
  VoiceAttachmentSchema,
  api,
  fields,
  taskAddAttachmentSchema,
  tasksAtom
} from "@digitask/shared-lib";
import { Block, Form, Input, When } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { FileUploader } from "../../../../../components/file-uploader";

type AttachmentType = "tv" | "internet" | "voice";

export default function AddSpecificTaskAttachment() {
  const { taskId, type: attachmentType } = useLocalSearchParams() as { taskId: string; type: AttachmentType };
  const tasks = useRecoilValue(tasksAtom);
  const task = tasks.find(task => task.id === +taskId);

  const taskAttachmentMutation = useMutation({
    mutationKey: [fields.tasks.create],
    mutationFn: (
      data: Omit<TVAttachmentSchema | InternetAttachmentSchema | VoiceAttachmentSchema, "passport" | "photo_modem"> & {
        task: number;
      }
    ) => api.services.tasks.$post(data)
  });

  const updateTaskAttachmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => api.services.tasks.$patchMedia(id, data)
  });

  const translation = {
    tv: "TV",
    internet: "İnternet",
    voice: "Səs"
  };

  useEffect(() => {
    if (!tasks.length) return;
    if (!task) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace({ pathname: "/(dashboard)/[taskId]/type/[type]", params: { taskId, type: attachmentType } });
      }
    }
  }, [task]);

  return (
    <KeyboardAvoidingView className="h-full">
      <Block.Scroll className="border-t-neutral-90 border-t-[1px] bg-white p-4" contentClassName="flex gap-4">
        <Form<AddAdditionSchema>
          schema={taskAddAttachmentSchema}
          defaultValues={{ type: attachmentType }}
          onSubmit={async ({ passport, photo_modem, ...data }) => {
            const response = await taskAttachmentMutation.mutateAsync({ ...data, task: +taskId });
            if (!response?.id) return;

            const [] = [passport, photo_modem].map((path, idx) => {
              const filename = path.split("/").pop();
              if (!filename) return;
              const match = /\.(\w+)$/.exec(filename);
              const type = match ? `image/${match[1]}` : `image`;
              const blob = new Blob([path], { type });
              const formData = new FormData();
              formData.append(idx === 0 ? "passport" : "photo_modem", blob);
              return formData;
            });

            // await updateTaskAttachmentMutation.mutateAsync({ id: response.id, data: formData });
          }}
        >
          <FileUploader.Controlled name="passport" label="Şəxsiyyət vəsiqəsinin fotosu" />

          <Text className="text-xl">
            Servis məlumatları <Text className="text-primary">{translation[attachmentType]}</Text>
          </Text>

          <FileUploader.Controlled name="photo_modem" label="Modemin arxa fotosu" />

          <Input.Controlled
            name="modem_SN"
            label={<Text className="text-neutral-60">Modem S/N</Text>}
            className="bg-neutral-90 rounded-2xl border-transparent"
          />

          <When condition={attachmentType === "internet"}>
            <Input.Controlled
              name="siqnal"
              label={<Text className="text-neutral-60">Siqnal</Text>}
              className="bg-neutral-90 rounded-2xl border-transparent"
            />

            <Input.Controlled
              name="internet_packs"
              label={<Text className="text-neutral-60">İnternet paketi</Text>}
              className="bg-neutral-90 rounded-2xl border-transparent"
            />
          </When>

          <When condition={attachmentType === "voice"}>
            <Input.Controlled
              name="home_number"
              type="number"
              label={<Text className="text-neutral-60">Ev nömrəsi</Text>}
              className="bg-neutral-90 rounded-2xl border-transparent"
            />

            <Input.Controlled
              name="password"
              label={<Text className="text-neutral-60">Parol</Text>}
              className="bg-neutral-90 rounded-2xl border-transparent"
            />
          </When>

          {/*<Input.Controlled name="note" />*/}

          <Form.Button>
            <Text className="p-4 text-center text-white">Yadda saxla</Text>
          </Form.Button>
        </Form>
      </Block.Scroll>
    </KeyboardAvoidingView>
  );
}
