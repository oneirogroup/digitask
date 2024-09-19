import { withExpo } from "@expo/next-adapter";

export default withExpo({
  transpilePackages: ["nativewind", "react-native-css-interop", "react-native-svg", "react-native-svg-web"],
  experimental: { reactCompiler: true, typedRoutes: true }
});
