import { baseConfig } from "../../tailwind.config";

export default baseConfig.extend({
  content: ["./{components,app}/**/*.{js,ts,jsx,tsx,mdx}"],
  extra: { important: "html", presets: [require("nativewind/preset")] }
});
