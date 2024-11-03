import { Image } from "expo-image";
import {
  ImagePickerSuccessResult,
  MediaTypeOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync
} from "expo-image-picker";
import { FC, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

import { api, fields } from "@digitask/shared-lib";
import { Icon, If, Modal, ModalRef } from "@mdreal/ui-kit";
import { useMutation } from "@tanstack/react-query";

import { FileUploaderExtended, FileUploaderProps } from "./file-uploader.types";

export const FileUploader: FC<FileUploaderProps> & FileUploaderExtended = ({
  label,
  value: prePickedImage,
  onFileUpload
}) => {
  const modalRef = useRef<ModalRef>(null);
  const [pickedImage, setPickedImage] = useState<ImagePickerSuccessResult | null>(null);

  const uploadFileMutation = useMutation({
    mutationKey: [fields.file.upload],
    mutationFn: (formData: FormData) => api.services.file.upload.$post(formData),
    onSuccess(data) {
      console.log(data);
    }
  });

  const handleImageUpload = async (result: ImagePickerSuccessResult) => {
    modalRef.current?.close();

    const localUri = result.assets[0]?.uri;
    if (!localUri) return;
    const filename = localUri.split("/").pop();
    if (!filename) return;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const blob = new Blob([localUri], { type });
    const formData = new FormData();
    formData.append("photo", blob);
    await uploadFileMutation.mutateAsync(formData);
    setPickedImage(result);
  };

  const pickImageFromCamera = async () => {
    const cameraPermission = await requestCameraPermissionsAsync();
    if (cameraPermission.granted) {
      const result = await launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        allowsMultipleSelection: false
      });

      if (!result.canceled) {
        await handleImageUpload(result);
      }
    }
  };

  const pickImageFromLibrary = async () => {
    const imagePermission = await requestMediaLibraryPermissionsAsync();
    if (imagePermission.granted) {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        allowsMultipleSelection: false
      });

      if (!result.canceled) {
        await handleImageUpload(result);
      }
    }
  };

  const onPrepare = () => {
    modalRef.current?.open();
  };

  return (
    <View className="flex gap-2">
      <Text className="text-neutral-60">{label}</Text>
      <Pressable onPress={onPrepare}>
        <View className="bg-neutral-95 border-neutral-90 flex flex-row rounded-2xl border-2 border-dashed p-4">
          <If condition={!!pickedImage}>
            <If.Then>
              <View className="flex flex-1 items-center justify-center">
                <Text className="text-primary">Yenisini əlavə et</Text>
              </View>
              <View>
                <Image source={{ uri: pickedImage?.assets[0]?.uri }} style={{ width: 40, height: 40 }} />
              </View>
            </If.Then>

            <If.Else>
              <View className="flex flex-1 items-center justify-center">
                <Text className="text-primary">Şəkil əlave et</Text>
              </View>
              <View className="rounded-full bg-white p-2">
                <Icon name="upload" />
              </View>
            </If.Else>
          </If>
        </View>
      </Pressable>

      <Modal ref={modalRef} type="bottom" height={200}>
        <View className="flex gap-4 p-4">
          <Pressable onPress={pickImageFromCamera}>
            <View className="bg-neutral-95 border-neutral-90 flex flex-row rounded-2xl border-2 border-dashed p-4">
              <View className="flex flex-1 items-center justify-center">
                <Text className="text-primary">Şəkil çək</Text>
              </View>
              <View className="rounded-full bg-white p-2">
                <Icon name="camera" />
              </View>
            </View>
          </Pressable>

          <Pressable onPress={pickImageFromLibrary}>
            <View className="bg-neutral-95 border-neutral-90 flex flex-row rounded-2xl border-2 border-dashed p-4">
              <View className="flex-1">
                <Text className="text-primary">Qalereyadan seç</Text>
                <Text className="text-neutral-20">(Maksimum fayl ölçüsü: 25 MB)</Text>
              </View>
              <View className="rounded-full bg-white p-2">
                <Icon name="upload" />
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

FileUploader.Controlled = ({ name, value, ...props }) => {
  return (
    <Controller
      name={name}
      render={({ field }) => <FileUploader {...props} value={value} onFileUpload={field.onChange} />}
    />
  );
};
