import { FileSystemUploadType, createUploadTask } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

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
import { AuthHttp, Block, Form, Input, When, logger } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { FileUploader } from "../../../../../../../components/file-uploader";
import { uploadFile } from "../../../../../../../utils/upload-file";

type AttachmentType = "tv" | "internet" | "voice";

const translation = {
  tv: "TV",
  internet: "İnternet",
  voice: "Səs"
};

export default function AddSpecificTaskAttachment() {
  const {
    taskId,
    taskType,
    type: attachmentType
  } = useLocalSearchParams() as {
    taskId: string;
    taskType: "connection" | "problem";
    type: AttachmentType;
  };
  const [isLoading, setIsLoading] = useState(false);

  const tasks = useRecoilValue(tasksAtom(taskType));
  const setTasks = useSetRecoilState(tasksAtom(taskType));
  const task = tasks.find(task => task.id === +taskId);

  const taskAttachmentMutation = useMutation({
    mutationKey: [fields.tasks.create],
    mutationFn: (
      data: Omit<TVAttachmentSchema | InternetAttachmentSchema | VoiceAttachmentSchema, "passport" | "photo_modem"> & {
        task: number;
      }
    ) => api.services.tasks.$post(data)
  });

  const taskMutation = useMutation({
    mutationKey: [fields.task],
    mutationFn: (taskId: number) => api.services.task.$get(+taskId)
  });

  useEffect(() => {
    if (!tasks.length) return;
    if (!task || task[`has_${attachmentType}`]) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace({ pathname: "/[taskId]/task-type/[taskType]", params: { taskId, taskType } });
      }
    }
  }, [task]);

  return (
    <KeyboardAvoidingView className="h-full">
      <Block.Scroll className="border-t-neutral-90 border-t-[1px] bg-white p-4" contentClassName="flex gap-4">
        <Form<AddAdditionSchema>
          schema={taskAddAttachmentSchema}
          defaultValues={{ type: attachmentType, passport: task?.passport }}
          onSubmit={async ({ passport, photo_modem, ...data }) => {
            console.log("passport", passport);
            console.log("photo_modem", photo_modem);

            setIsLoading(true);
            await uploadFile(
              `${AuthHttp.settings().baseUrl}/services/update_task_image/${taskId}/`,
              passport,
              "passport"
            );
            const attachment = await taskAttachmentMutation.mutateAsync({ ...data, task: +taskId });
            await uploadFile(
              `${AuthHttp.settings().baseUrl}/services/update_tv/${attachment.id}/`,
              photo_modem,
              "photo_modem"
            );
            const task = await taskMutation.mutateAsync(+taskId);
            setTasks(prevTasks => {
              const taskIndex = prevTasks.findIndex(task => task.id === +taskId);
              const updatedTask = { ...prevTasks[taskIndex], ...task };
              return prevTasks.map((task, index) => (index === taskIndex ? updatedTask : task));
            });
            setIsLoading(false);

            router.replace({
              pathname: "/[taskId]/task-type/[taskType]",
              params: { taskId, taskType }
            });
          }}
        >
          <FileUploader.Controlled name="passport" label="Şəxsiyyət vəsiqəsinin fotosu" value={task?.passport} />

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

          <Input.Controlled
            name="note"
            label={<Text className="text-neutral-60">Qeyd</Text>}
            className="bg-neutral-90 rounded-2xl border-transparent"
          />

          <Form.Button isLoading={isLoading} disabled={isLoading}>
            <Text className="p-4 text-center text-white">Yadda saxla</Text>
          </Form.Button>
        </Form>
      </Block.Scroll>
    </KeyboardAvoidingView>
  );
}
