import { ExpoConfig } from "expo/config";
import "ts-node/register";

import { version } from "./package.json";

export default {
  name: "DigiTask",
  slug: "digitask",
  scheme: "digitask",
  owner: "oneirogroup",
  version,
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  runtimeVersion: version,
  splash: {
    image: "./assets/images/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  android: {
    package: "com.oneirogroup.digitask"
  },
  ios: {
    supportsTablet: true
  },
  plugins: [
    "expo-router",
    "expo-font",
    ["expo-image-picker", { photosPermission: "Şəkili seçmək üçün icazə", cameraPermission: "Şəkil çəkmək üçün icazə" }]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  },
  extra: {
    eas: {
      projectId: "19a90db8-9dbf-4462-82b1-20715313aebb"
    }
  }
} satisfies ExpoConfig;
