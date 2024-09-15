import { baseConfig } from "../../tailwind.config";

export default baseConfig.extend({
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  extra: { presets: [require("nativewind/preset")] }
});
