import { FC } from "react";

export interface FileUploaderProps {
  label: string;
  value?: string;
  onFileUpload?(fileId: string): void;
}

export interface FileUploaderExtended {
  Controlled: FC<FileUploaderProps & { name: string; value: string }>;
}
