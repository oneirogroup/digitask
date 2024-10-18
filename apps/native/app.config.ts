import { ExpoConfig } from "expo/config";
import "ts-node/register";

export default {
  name: "DigiTask",
  slug: "digitask",
  scheme: "digitask",
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
      projectId: "6bd68789-3a70-4f7f-8e96-c813e131dfd0"
    }
  }
} satisfies ExpoConfig;
