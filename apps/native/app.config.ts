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
  icon: "./assets/images/logo-colored.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  runtimeVersion: version,
  splash: {
    image: "./assets/images/logo.png",
    resizeMode: "contain",
    backgroundColor: "#005ABF"
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
    [
      "expo-image-picker",
      {
        photosPermission: "$(PRODUCT_NAME) şəkili seçməyə icazə verin",
        cameraPermission: "$(PRODUCT_NAME) şəkil çəkməyə icazə verin"
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "$(PRODUCT_NAME) məkanınızdan istifadə etməyə icazə verin.",
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true
      }
    ]
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
