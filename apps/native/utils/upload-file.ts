import { FileSystemUploadType, createUploadTask } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";

import { AuthHttp, logger } from "@mdreal/ui-kit";

export const uploadFile = async (url: string, asset: ImagePickerAsset, fileKey: string) => {
  await AuthHttp.instance().refreshToken();
  const token = AuthHttp.settings().getTokens();
  logger.debug("digitask.native:file-upload:asset.uri", asset.uri);
  logger.debug("digitask.native:file-upload:authorization-token", `Authorization: Bearer ${token.access}`);
  const uploadTask = createUploadTask(
    url,
    asset.uri,
    {
      fieldName: fileKey,
      httpMethod: "PATCH",
      uploadType: FileSystemUploadType.MULTIPART,
      mimeType: asset.mimeType,
      headers: { Authorization: `Bearer ${token.access}` }
    },
    ({ totalBytesSent, totalBytesExpectedToSend }) => {
      const progress = parseFloat((totalBytesSent / (totalBytesExpectedToSend || 1)).toFixed(2));
      logger.debug("digitask.native:file-upload:progress", progress);
    }
  );

  const result = await uploadTask.uploadAsync();
  if (!result) {
    throw new Error("File upload failed");
  }
  return result.body;
};
