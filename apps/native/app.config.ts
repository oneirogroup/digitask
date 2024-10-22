import { ExpoConfig } from "expo/config";
import "ts-node/register";

export default {
  name: "DigiTask",
  slug: "digitask",
  scheme: "digitask",
  owner: "oneirogroup",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    package: "com.oneirogroup.digitask",
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    }
  },
  plugins: ["expo-router", "expo-font"],
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
