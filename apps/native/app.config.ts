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
    adaptiveIcon: {
      backgroundColor: "#ffffff"
    }
  },
  plugins: ["expo-router", "expo-font"],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  }
} satisfies ExpoConfig;
