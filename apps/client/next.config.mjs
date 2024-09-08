import { withExpo } from "@expo/next-adapter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  experimental: {
    reactCompiler: true,
    typedRoutes: true
  }
};

export default withExpo(nextConfig);
