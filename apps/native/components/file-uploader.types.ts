import type { ImagePickerAsset } from "expo-image-picker";
import { FC } from "react";

export interface FileUploaderProps {
  label: string;
  value?: string;
  onFileUpload?(fileId: ImagePickerAsset): void;
}

export interface FileUploaderExtended {
  Controlled: FC<FileUploaderProps & { name: string; value?: string }>;
}
